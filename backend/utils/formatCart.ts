export const formatCart = (cart: any) => {
  let subtotal = 0;
  let totalQuantity = 0;

  const formattedItems = cart.items.map((item: any) => {
    const product = item.product;

    console.log("CART ITEM PRODUCT:", product);

    if (!product) {
      throw new Error(
        `Cart contains invalid/missing product: ${item.product}`
      );
    }

    const itemSubtotal = product.price * item.quantity;

    subtotal += itemSubtotal;
    totalQuantity += item.quantity;

    return {
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        isActive: product.isActive,
      },
      quantity: item.quantity,
      subtotal: itemSubtotal,
    };
  });

  return {
    items: formattedItems,
    totalItems: formattedItems.length,
    totalQuantity,
    subtotal,
  };
};