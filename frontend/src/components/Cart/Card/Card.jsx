import Link from 'next/link';

export const Card = ({ cart, onQuantityChange, onRemove }) => {
  const {
    name,
    image,
    id,
    isStocked,
    productNumber,
    oldPrice,
    price,
    quantity,
  } = cart;

  // Modern styled components using inline styles
  const cardStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.3s ease',
    border: '1px solid #f0f0f0',
  };

  const imageContainerStyle = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
    width: '100px',
    height: '100px',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  };

  const productInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    flex: 1,
  };

  const productNameStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  };

  const stockBadgeStyle = {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    fontSize: '12px',
    fontWeight: '500',
  };

  const skuStyle = {
    color: '#999',
    fontSize: '13px',
  };

  const priceStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#d05278',
  };

  const oldPriceStyle = {
    textDecoration: 'line-through',
    color: '#999',
    marginRight: '8px',
    fontSize: '14px',
  };

  const counterBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '4px',
    background: '#f8f8f8',
  };

  const counterButtonStyle = {
    border: 'none',
    background: 'none',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.2s ease',
  };

  const counterInputStyle = {
    width: '40px',
    textAlign: 'center',
    border: 'none',
    background: 'transparent',
    fontSize: '14px',
    fontWeight: '500',
  };

  const removeButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#d05278',
    cursor: 'pointer',
    padding: '8px',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '15px',
    transition: 'all 0.2s ease',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link href={`/product/${id}`}>
          <a style={imageContainerStyle}>
            <img src={image} style={imageStyle} alt={name} />
          </a>
        </Link>

        <div style={productInfoStyle}>
          <Link href={`/product/${id}`}>
            <a style={productNameStyle}>{name}</a>
          </Link>
          {isStocked && (
            <span style={stockBadgeStyle}>In Stock</span>
          )}
          <span style={skuStyle}>SKU: {productNumber}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={priceStyle}>
            {oldPrice && <span style={oldPriceStyle}>${oldPrice}</span>}
            ${price}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={counterBoxStyle}>
              <button
                style={counterButtonStyle}
                onClick={() => onQuantityChange(id, 'decrease')}
              >
                -
              </button>
              <input
                type='text'
                style={counterInputStyle}
                disabled
                value={quantity}
              />
              <button
                style={counterButtonStyle}
                onClick={() => onQuantityChange(id, 'increase')}
              >
                +
              </button>
            </div>
            <button 
              onClick={onRemove}
              style={removeButtonStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#fff1f4';
                e.currentTarget.style.color = '#ff0000';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#d05278';
              }}
            >
              ×
            </button>
          </div>

          <div style={{ 
            fontWeight: '600', 
            fontSize: '16px',
            minWidth: '80px',
            textAlign: 'right'
          }}>
            ${(price * quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
