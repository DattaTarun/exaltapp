import React from 'react'
import { Link } from 'react-router-dom'
import './card.scss'
function Card({item}) {
  return (
    <Link className='link' to={`/product/${item.id}`}>
        <div className='card'>
          <div className='image'>
              {item?.attributes.isnew && <span>New Season</span>}
              <img src={'http://localhost:1337'+ item?.attributes.ima.data.attributes.url} alt='' className='mainImg'></img>
              <img src={'http://localhost:1337'+item?.attributes.img2.data.attributes.url} alt='' className='secondImg'></img>
          </div>
        <h2>{item?.attributes.title}</h2>
        <div className='prices'>
            <h3>${item?.attributes.price+20}</h3>
            <h3>${item?.attributes.price}</h3>
        </div>
         </div>
    </Link>
  )
}

export default Card
