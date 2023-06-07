import CartContext from '@/context/CartContext'
import formatMoney from '@/utils/formatMoney'
import React, { ChangeEventHandler, SetStateAction, useContext, useState } from 'react'
import Checkbox from '../widgets/Checkbox'

type Props = {
  product: Product,
  handleCheckbox: ChangeEventHandler<HTMLInputElement>,
}

const ProductRow = ({ product, handleCheckbox }: Props) => {
  const { name, price, sku, discount, quantity } = product
  
  const { updateProduct, removeProduct } = useContext(CartContext)
  
  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    if (target.name === "product_quantity") {
      updateProduct({
        ...product,
        quantity: parseFloat(target.value),
      })
    }
  }

  return (
    <tr key={`${name.split(" ").join("-")}-${sku}`}>
      <td className=" font-medium text-gray-900 dark:text-white whitespace-nowrap">
        {sku}
      </td>
      <td className="font-bold">
        {name}
      </td>
      <td className="">
        <input
          id=""
          name="product_quantity"
          type="number"
          value={quantity}
          placeholder='0.00'
          onChange={handleChange}
          className="border-gray-300 pl-2 py-1 text-right border rounded-md w-28"
        />
      </td>
      <td className="text-end">
        {formatMoney(price)}
      </td>
      <td className="text-end">
        % {discount}
      </td>
      <td className="text-end">
        {formatMoney(quantity * price)}
      </td>
      <td className="atext-right">
        <button onClick={() => removeProduct(sku)}>
          🗑 Eliminar
        </button>
      </td>
      <td className="w-4 p-4">
        <Checkbox name="delete-product" value={sku} onChange={handleCheckbox} />
      </td>
    </tr>
  )
}


export default ProductRow