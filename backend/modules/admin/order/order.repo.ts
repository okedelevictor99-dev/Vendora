import { PaginationOptions,getSkip} from "@/utils/pagination";
import { OrderStatus,RefundStatus,Order } from "@/models/order.model";

export interface AdminOrderFilters {
  status?: OrderStatus;
  refundStatus?: RefundStatus;
}

export const findAllOrders = async (
  options: PaginationOptions,
  filters: AdminOrderFilters & { search?: string } = {}
) => {
  const skip = getSkip(options);

  const matchQuery: Record<string, any> = {};

  if (filters.status) {
    matchQuery.status = filters.status;
  }

  if (filters.refundStatus) {
    matchQuery.refundStatus = filters.refundStatus;
  }

  const pipeline: any[] = [
    {
      $match: matchQuery,
    },

    // Get user details
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    // Only expose safe user fields
    {
      $project: {
        "user.password": 0,
        "user.passwordResetToken": 0,
        "user.passwordResetExpires": 0,
        "user.emailVerificationToken": 0,
        "user.emailVerificationExpires": 0,
        "user.emailChangeToken": 0,
        "user.emailChangeExpires": 0,
        "user.pendingEmail": 0,
        "user.isEmailVerified": 0,
        "user.createdAt": 0,
        "user.updatedAt": 0,
        "user.__v": 0,
      },
    },
  ];


  // Search by customer name
  if (filters.search) {
    pipeline.push({
      $match: {
        $or: [
          {
            "user.name": {
              $regex: filters.search,
              $options: "i",
            },
          },
          {
            "user.email": {
              $regex: filters.search,
              $options: "i",
            },
          },
        ],
      },
    });
  }
    pipeline.push(

    // Get product details
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },

    // Only expose the product fields the admin list actually needs
    {
      $project: {
        user: 1,
        reference: 1,
        items: 1,
        totalAmount: 1,
        status: 1,
        refundStatus: 1,
        refundNote: 1,
        refundedAt: 1,
        createdAt: 1,
        updatedAt: 1,
        "productDetails._id": 1,
        "productDetails.name": 1,
        "productDetails.images": 1,
        "productDetails.price": 1,
        "productDetails.category": 1,
      },
    },

    // Replace item.product ObjectId with full product object
    {
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              product: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$productDetails",
                      as: "product",
                      cond: {
                        $eq: [
                          "$$product._id",
                          "$$item.product",
                        ],
                      },
                    },
                  },
                  0,
                ],
              },

              quantity: "$$item.quantity",

              price: "$$item.price",
            },
          },
        },
      },
    },


    // Remove unnecessary productDetails array
    {
      $project: {
        productDetails: 0,
      },
    },


    {
      $sort: {
        createdAt: -1,
      },
    },


    {
      $skip: skip,
    },


    {
      $limit: options.limit,
    }
  );


  const countPipeline = [
    ...pipeline.slice(0, pipeline.length - 3),
    {
      $count: "total",
    },
  ];


  const [orders, total] = await Promise.all([
    Order.aggregate(pipeline),

    Order.aggregate(countPipeline).then(
      (result) => result[0]?.total || 0
    ),
  ]);


  return {
    orders,
    total,
  };
};
export const findOrderByIdForAdmin = async (orderId: string) => {
  return Order.findById(orderId)
    .select("-stockReserved -stockReservationExpiry -verifyAttempts -lastVerifiedAt")
    .populate("user", "name email")
    .populate("items.product", "name images price category")
    .lean();
};



export const markOrderAsShipped = async (reference: string) => {
  return Order.findOneAndUpdate(
    { reference, status: "paid" }, 
    {
      $set: {
        status: "shipped",
        shippedAt: new Date(),
      },
    },
    { new: true }
  );
};

export const markOrderAsDelivered = async (reference: string) => {
  return Order.findOneAndUpdate(
    { reference, status: "shipped" }, 
    {
      $set: {
        status: "delivered",
        deliveredAt: new Date(),
      },
    },
    { new: true }
  );
};
export const markOrderAsRefunded = async (
  reference: string,
  note?: string,
) => {
  return Order.findOneAndUpdate(
    { 
      reference, 
      status: "cannot_fulfill", 
      refundStatus: "pending",  
    },
    { 
      $set: { 
        refundStatus: "refunded",
        ...(note && { refundNote: note }),
        refundedAt: new Date(),
      } 
    },
    { new: true }
  );
};


