import React from 'react';
import IconTemplate from '../IconTemplate';

interface BotBuilderIconProps {
  active: boolean;
}

const BotBuilderIcon: React.FC<BotBuilderIconProps> = ({ active }) => {
  return (
    <IconTemplate active={active} name="Assistants">
      <path
        d="M1.35192 15.8992C1.35192 15.908 1.35192 15.9242 1.34192 15.9467C1.34567 15.9317 1.34817 15.9155 1.35192 15.8992Z"
        fill="black"
      />
      <path d="M18.1733 16.6044C18.027 16.6013 17.8825 16.5712 17.7471 16.5156L15.2235 15.6209L15.2049 15.6133C15.1498 15.5904 15.0907 15.5789 15.0311 15.5796C14.9761 15.5796 14.9216 15.5896 14.8702 15.6089C14.8089 15.632 14.2564 15.8396 13.6769 15.9987C13.3626 16.0849 12.2689 16.3662 11.3911 16.3662C9.14754 16.3662 7.04976 15.504 5.48487 13.9382C3.94071 12.4035 3.07473 10.3149 3.07998 8.13778C3.07996 7.57618 3.14046 7.0162 3.26042 6.46756C3.65109 4.66223 4.68576 3.02 6.17376 1.84534C7.70014 0.64802 9.58448 -0.00184934 11.5244 3.95292e-06C13.8449 3.95292e-06 16.0071 0.888893 17.6133 2.49689C19.1315 4.02 19.9635 6.02267 19.9569 8.13556C19.9556 9.70559 19.4867 11.2397 18.6102 12.5422L18.6018 12.5547L18.5689 12.5991C18.5613 12.6093 18.5538 12.6191 18.5466 12.6293L18.54 12.6413C18.5223 12.6714 18.5063 12.7024 18.492 12.7342L19.1915 15.2204C19.2225 15.323 19.2392 15.4293 19.2413 15.5364C19.2417 15.8198 19.1293 16.0917 18.9289 16.292C18.7285 16.4924 18.4567 16.6048 18.1733 16.6044Z" />
      <path d="M11.9498 17.484C11.8569 17.3033 11.69 17.1719 11.4925 17.124C11.2356 17.056 10.936 17.0676 10.7071 17.0507C8.54595 16.9004 6.51222 15.9729 4.9818 14.4396C3.62124 13.0866 2.73702 11.3283 2.46225 9.42934C2.40003 8.99645 2.40003 8.8889 2.40003 8.8889C2.39997 8.59317 2.2169 8.32835 1.94027 8.22382C1.66363 8.11929 1.35118 8.19688 1.15558 8.41867C1.15558 8.41867 0.805359 8.80001 0.640026 9.18267C-0.301207 11.3513 -0.118501 13.8438 1.12891 15.852C1.24447 16.0445 1.24447 16.1333 1.21869 16.3333C1.09736 16.9605 0.884915 18.0667 0.774248 18.6405C0.699638 19.0193 0.835631 19.409 1.1298 19.6591L1.15025 19.6765C1.34136 19.8282 1.57819 19.9109 1.82225 19.9111C1.95952 19.9112 2.09546 19.8842 2.22225 19.8316L4.60047 18.9138C4.68235 18.8827 4.77281 18.8827 4.85469 18.9138C5.79114 19.2622 6.7658 19.4471 7.68936 19.4471C8.84009 19.4482 9.97689 19.1954 11.0187 18.7067C11.2614 18.5929 11.6409 18.4693 11.8631 18.2125C12.035 18.0088 12.0691 17.7223 11.9498 17.484Z" />
    </IconTemplate>
  );
};

export default BotBuilderIcon;
