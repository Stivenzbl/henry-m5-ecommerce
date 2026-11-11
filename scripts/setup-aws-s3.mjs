import { 
  S3Client, 
  CreateBucketCommand, 
  HeadBucketCommand, 
  PutBucketCorsCommand, 
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.argv[2];
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.argv[3];
  const bucketName = process.env.AWS_S3_BUCKET_NAME || process.argv[4] || `patagonix-retail-${Date.now().toString().slice(-6)}`;
  const region = process.env.AWS_REGION || process.argv[5] || 'us-east-1';

  if (!accessKeyId || !secretAccessKey) {
    console.error('❌ Error: Faltan las credenciales AWS.');
    console.error('Uso: node scripts/setup-aws-s3.mjs <AWS_ACCESS_KEY_ID> <AWS_SECRET_ACCESS_KEY> [BUCKET_NAME] [REGION]');
    process.exit(1);
  }

  console.log(`🚀 Iniciando aprovisionamiento automático de S3:`);
  console.log(`   Bucket: ${bucketName}`);
  console.log(`   Región: ${region}`);

  const s3 = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  // 1. Crear Bucket si no existe
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`✔ El bucket "${bucketName}" ya existe y tienes acceso.`);
  } catch (err) {
    console.log(`📦 Creando bucket "${bucketName}"...`);
    try {
      const createParams = {
        Bucket: bucketName,
        ...(region !== 'us-east-1' ? {
          CreateBucketConfiguration: {
            LocationConstraint: region,
          },
        } : {}),
      };
      await s3.send(new CreateBucketCommand(createParams));
      console.log(`✔ Bucket "${bucketName}" creado con éxito.`);
    } catch (createErr) {
      console.error(`❌ Error al crear bucket:`, createErr.message);
      process.exit(1);
    }
  }

  // 2. Desactivar bloqueo público del bucket (para permitir ver fotos de productos)
  try {
    console.log(`🔓 Configurando acceso público para lectura de imágenes...`);
    await s3.send(new PutPublicAccessBlockCommand({
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      },
    }));
    console.log(`✔ Bloqueo público desactivado para permitir lectura pública de fotos.`);
  } catch (blockErr) {
    console.warn(`⚠️ Nota sobre permisos de cuenta: ${blockErr.message}`);
  }

  // 3. Aplicar Política de Bucket para lectura pública
  try {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    };

    await s3.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(policy),
    }));
    console.log(`✔ Política de lectura pública asignada exitosamente.`);
  } catch (policyErr) {
    console.warn(`⚠️ Política pública no se pudo asignar directamente (posible restricción a nivel de cuenta AWS): ${policyErr.message}`);
  }

  // 4. Configurar CORS (Crucial para uploads directos desde el browser)
  try {
    console.log(`🌐 Configurando reglas CORS en el bucket...`);
    await s3.send(new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['PUT', 'POST', 'GET', 'HEAD'],
            AllowedOrigins: [
              'https://henry-m5-ecommerce.vercel.app',
              'http://localhost:5173',
              'http://localhost:4173',
              'http://localhost:3000',
            ],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }));
    console.log(`✔ Reglas CORS configuradas exitosamente.`);
  } catch (corsErr) {
    console.error(`❌ Error configurando CORS:`, corsErr.message);
  }

  // 5. Test de subida de objeto
  try {
    console.log(`🧪 Probando subida de archivo de verificación a S3...`);
    const testKey = `products/test-connection-${Date.now()}.txt`;
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: testKey,
      Body: 'Patagonix Retail S3 Integration Verification Success!',
      ContentType: 'text/plain',
    }));
    const testUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${testKey}`;
    console.log(`✔ ¡Subida de prueba exitosa!`);
    console.log(`   URL generada: ${testUrl}`);
  } catch (uploadErr) {
    console.error(`❌ Error en la prueba de subida:`, uploadErr.message);
  }

  // 6. Escribir archivo .env local
  const envContent = `# Variables locales para desarrollo y Vercel
AWS_ACCESS_KEY_ID=${accessKeyId}
AWS_SECRET_ACCESS_KEY=${secretAccessKey}
AWS_REGION=${region}
AWS_S3_BUCKET_NAME=${bucketName}
`;

  const envPath = path.resolve(process.cwd(), '.env');
  fs.writeFileSync(envPath, envContent, 'utf-8');
  console.log(`\n📄 Archivo .env generado localmente con tus credenciales.`);
  console.log(`\n🎉 Configuración completada.`);
}

main().catch(console.error);
