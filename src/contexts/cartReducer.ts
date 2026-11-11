import { CartState, CartAction, CartItem } from '../types/cart';

export const initialCartState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

function calculateTotals(items: CartItem[]): { totalQuantity: number; totalPrice: number } {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const rawPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalPrice = Math.round(rawPrice * 100) / 100;
  return { totalQuantity, totalPrice };
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const quantityToAdd = action.payload.quantity ?? 1;
      if (quantityToAdd <= 0) return state;

      const existingIndex = state.items.findIndex(
        item => item.product.id === action.payload.product.id
      );

      let newItems: CartItem[];

      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) => {
          if (index === existingIndex) {
            return {
              ...item,
              quantity: item.quantity + quantityToAdd,
            };
          }
          return item;
        });
      } else {
        newItems = [
          ...state.items,
          {
            product: action.payload.product,
            quantity: quantityToAdd,
          },
        ];
      }

      const { totalQuantity, totalPrice } = calculateTotals(newItems);
      return {
        items: newItems,
        totalQuantity,
        totalPrice,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => item.product.id !== action.payload.productId
      );
      const { totalQuantity, totalPrice } = calculateTotals(newItems);
      return {
        items: newItems,
        totalQuantity,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(
          item => item.product.id !== action.payload.productId
        );
        const { totalQuantity, totalPrice } = calculateTotals(newItems);
        return {
          items: newItems,
          totalQuantity,
          totalPrice,
        };
      }

      const newItems = state.items.map(item => {
        if (item.product.id === action.payload.productId) {
          return {
            ...item,
            quantity: action.payload.quantity,
          };
        }
        return item;
      });

      const { totalQuantity, totalPrice } = calculateTotals(newItems);
      return {
        items: newItems,
        totalQuantity,
        totalPrice,
      };
    }

    case 'CLEAR_CART': {
      return initialCartState;
    }

    default:
      return state;
  }
}
