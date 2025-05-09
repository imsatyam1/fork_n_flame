import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import React from 'react';

type DeliveryDetails = {
  name: string;
  address: string;
};

type Restaurant = {
  _id: string;
  totalAmount: number;
  status: string;
  deliveryDetails: DeliveryDetails;
};

const restaurantOrder: Restaurant[] = [
  {
    _id: "1",
    totalAmount: 4000,
    status: "pending",
    deliveryDetails: {
      name: "Satyam",
      address: "Delhi"
    }
  }
];

const Orders = () => {
  const handleStatusChange = async (id: string, status: string) => {
    // logic here
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
        Orders Overview
      </h1>

      <div className="space-y-10">
        {restaurantOrder.map((order) => (
          <div
            key={order._id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 md:p-8 transition hover:shadow-xl"
          >
            <div className="flex-1 w-full mb-6 md:mb-0">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                {order.deliveryDetails.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Address:
                </span>{" "}
                {order.deliveryDetails.address}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Total Amount:
                </span>{" "}
                ₹{(order.totalAmount / 100).toFixed(2)}
              </p>
            </div>

            <div className="w-full md:w-1/3">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Status
              </Label>
              <Select
                onValueChange={(newStatus) =>
                  handleStatusChange(order._id, newStatus)
                }
                defaultValue={order.status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[
                      "Pending",
                      "Confirmed",
                      "Preparing",
                      "Out For Delivery",
                      "Delivered"
                    ].map((status, idx) => (
                      <SelectItem key={idx} value={status.toLowerCase()}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
