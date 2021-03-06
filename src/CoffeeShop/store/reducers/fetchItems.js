import * as actionTypes from "../actions/actionTypes";

let initialState = {
  items: [],
  showShoppingSummary: false,
  loading: false,
  fetchItemsError: false,
  submitOrderError: false,
  submitOrderSuccess: false,
  showShoppingSummaryModal: false,
  totalPrice: 0,
};

const fetchItemsStart = (state, action) => {
  return { ...state, loading: true, fetchItemsError: false };
};

const fetchItemsSuccess = (state, action) => {
  return { ...state, items: action.items, loading: false };
};

const fetchItemsFail = (state, action) => {
  return { ...state, loading: false, fetchItemsError: action.error };
};

const addItem = (state, action) => {
  return Object.assign(
    {},
    state,
    { totalPrice: state.totalPrice + state.items[action.index].price },
    {
      items: state.items.map((item, index) => {
        if (index === action.index) {
          return Object.assign({}, item, {
            count: state.items[action.index].count + 1,
          });
        }
        return item;
      }),
    }
  );
};

const removeItem = (state, action) => {
  return Object.assign(
    {},
    state,
    { totalPrice: state.totalPrice - state.items[action.index].price },
    {
      items: state.items.map((item, index) => {
        if (index === action.index) {
          return Object.assign({}, item, {
            count: state.items[action.index].count - 1,
          });
        }
        return item;
      }),
    }
  );
};

const submitOrderStart = (state, action) => {
  return {
    ...state,
    loading: true,
    submitOrderSuccess: false,
    submitOrderError: false,
    showShoppingSummaryModal: true,
  };
};

const submitOrderSuccess = (state, action) => {
  let itemsCopy = [];
  let newObj = {};
  let count = 0;
  for (let i = 0; i < state.items.length; i++) {
    newObj = {
      name: state.items[i].name,
      description: state.items[i].description,
      price: state.items[i].price,
      count: count,
    };
    itemsCopy.push(newObj);
  }
  return {
    ...state,
    items: itemsCopy,
    loading: false,
    submitOrderSuccess: true,
    submitOrderError: false,
    totalPrice: 0,
  };
};

const submitOrderSuccessFalse = (state, action) => {
  return { ...state, submitOrderSuccess: false };
};

const submitOrderFail = (state, action) => {
  return {
    ...state,
    loading: false,
    submitOrderSuccess: false,
    submitOrderError: action.error,
    showShoppingSummaryModal: true,
  };
};

const showShoppingSummaryModalReducer = (state, action) => {
  return { ...state, showShoppingSummaryModal: true };
};

const closeShoppingSummaryModalReducer = (state, action) => {
  return { ...state, showShoppingSummaryModal: false, submitOrderError: false };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ITEMS_START:
      return fetchItemsStart(state, action);
    case actionTypes.FETCH_ITEMS_SUCCESS:
      return fetchItemsSuccess(state, action);
    case actionTypes.FETCH_ITEMS_FAIL:
      return fetchItemsFail(state, action);

    case actionTypes.ADD_ITEM:
      return addItem(state, action);
    case actionTypes.REMOVE_ITEM:
      return removeItem(state, action);
    case actionTypes.SUBMIT_ORDER_START:
      return submitOrderStart(state, action);
    case actionTypes.SUBMIT_ORDER_SUCCESS:
      return submitOrderSuccess(state, action);
    case actionTypes.SUBMIT_ORDER_SUCCESS_FALSE:
      return submitOrderSuccessFalse(state, action);
    case actionTypes.SUBMIT_ORDER_FAIL:
      return submitOrderFail(state, action);
    case actionTypes.SHOW_SHOPPING_SUMMARY_MODAL_ACTION:
      return showShoppingSummaryModalReducer(state, action);
    case actionTypes.CLOSE_SHOPPING_SUMMARY_MODAL_ACTION:
      return closeShoppingSummaryModalReducer(state, action);

    default:
      return state;
  }
};

export default reducer;
