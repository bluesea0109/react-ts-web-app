import React from 'react';

interface SVGProps {
  active: boolean;
}

const ImageLabeling = (props: SVGProps) => {
  const { active } = props;
  return (
    <div style={ active ? {borderRight: '4px solid #4a90e2', padding: '5px 20px'} : { padding: '5px 20px'}}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 512 512"
        style={active ? { fill: 'rgb(74, 144, 226)' } : { fill: '#eee' }}>
        <title>ionicons-v5-e</title>
        <path d="M450.29,112H142c-34,0-62,27.51-62,61.33V418.67C80,452.49,108,480,142,480H450c34,0,62-26.18,62-60V173.33C512,139.51,484.32,112,450.29,112Zm-77.15,61.34a46,46,0,1,1-46.28,46A46.19,46.19,0,0,1,373.14,173.33Zm-231.55,276c-17,0-29.86-13.75-29.86-30.66V353.85l90.46-80.79a46.54,46.54,0,0,1,63.44,1.83L328.27,337l-113,112.33ZM480,418.67a30.67,30.67,0,0,1-30.71,30.66H259L376.08,333a46.24,46.24,0,0,1,59.44-.16L480,370.59Z" />
        <path d="M384,32H64A64,64,0,0,0,0,96V352a64.11,64.11,0,0,0,48,62V152a72,72,0,0,1,72-72H446A64.11,64.11,0,0,0,384,32Z" />
      </svg>
      <div style={{fontSize: '10px', marginBottom: '15px'}}>Image Labeling</div>
    </div>
  );
};

export default ImageLabeling;
