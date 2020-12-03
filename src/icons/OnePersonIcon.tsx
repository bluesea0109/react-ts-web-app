import React from 'react';

export default function OnePersonIcon({ color }: { color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.3952 2.01813C9.78705 1.36156 8.93768 1 8.00018 1C7.05768 1 6.20549 1.35937 5.60018 2.01187C4.9883 2.67156 4.69018 3.56813 4.76018 4.53625C4.89893 6.44625 6.35237 8 8.00018 8C9.64799 8 11.0989 6.44656 11.2399 4.53687C11.3108 3.5775 11.0108 2.68281 10.3952 2.01813ZM13.5002 15H2.50018C2.3562 15.0019 2.21361 14.9716 2.08279 14.9115C1.95197 14.8513 1.83621 14.7627 1.74393 14.6522C1.5408 14.4094 1.45893 14.0778 1.51955 13.7425C1.7833 12.2794 2.60643 11.0503 3.90018 10.1875C5.04955 9.42156 6.50549 9 8.00018 9C9.49487 9 10.9508 9.42188 12.1002 10.1875C13.3939 11.05 14.2171 12.2791 14.4808 13.7422C14.5414 14.0775 14.4596 14.4091 14.2564 14.6519C14.1642 14.7625 14.0484 14.8511 13.9176 14.9113C13.7868 14.9715 13.6442 15.0018 13.5002 15Z"
        fill={color || 'black'}
      />
    </svg>
  );
}
