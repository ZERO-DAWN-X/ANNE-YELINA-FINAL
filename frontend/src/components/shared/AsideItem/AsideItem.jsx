import Link from 'next/link';

export const AsideItem = ({ id, image, name, price, oldPrice, star }) => {
  return (
    <>
      {/* <!-- BEING SHOP ASIDE CARD  --> */}
      <Link href={`/product/${id}`}>
        <a className="shop-aside__item-product">
          <div className="shop-aside__item-product-img">
            <img src={image} className="js-img" alt="" />
          </div>
          <div className="shop-aside__item-product-info">
            <span className="shop-aside__item-product-title">
              {name}
            </span>
            <span className="shop-aside__item-product-price">
              {oldPrice && <span>${oldPrice}</span>}${price}
            </span>
            {star && (
              <ul className="star-rating">
                {[...Array(star)].map((_, index) => (
                  <li key={index}>
                    <i className="icon-star"></i>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </a>
      </Link>
      {/* <!-- SHOP ASIDE CARD EOF  --> */}
    </>
  );
};
