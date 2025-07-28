import React from 'react'
import Card from './Card'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
    const { products } = useAppContext()
    return (
        <div className='mt-16 text-2xl md:text-3xl font-medium'>
            <p>Best Sellers</p>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
                {products.filter((product) => product.inStock).slice(0,5).map((product, index) => (
                    <Card key={index} product={product} />
                ))}

            </div>
        </div>
    )
}

export default BestSeller
