export const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
export const shoeSizes = ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"];
export const colors = [
  "Red",
  "Blue",
  "Green",
  "Black",
  "White",
  "Yellow",
  "Orange",
  "Purple",
  "Brown",
  "Gold",  
  "Silver",
];
export const brandOptions = [
    { value: "0", label: "Select Type" },
    { value: "Tops", label: "Tops" },
    { value: "Shirts", label: "Shirts" },
    { value: "Jackets,Sweatshirts&Blazers", label: "Jackets, Sweatshirts & Blazers" },
    { value: "Denim", label: "Denim" },
    { value: "Pants", label: "Pants" },
    { value: "Shorts", label: "Shorts" },
    { value: "Shoes", label: "Shoes" },
    { value: "Bags&Wallets", label: "Bags & Wallets" },
    { value: "Belts", label: "Belts" },
    { value: "Hats&Scarves", label: "Hats & Scarves" },
  ];
  
  export const categoryOptions = [
    { value: "0", label: "Select Category" },
    { value: "Summer", label: "Summer" },
    { value: "Winter", label: "Winter" },
    { value: "Accessories", label: "Accessories" },
  ];
export const NumberInput = ({ label, value, onChange }) => (
    <div>
        <label>{label}</label>
        <input type="number" value={value} onChange={onChange} />
    </div>
);

export const TextArea = ({ label, value, onChange }) => (
    <div>
        <label>{label}</label>
        <textarea value={value} onChange={onChange} />
    </div>
);

export const CheckboxInput = ({ label, checked, onChange }) => (
    <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        {label}
    </label>
);

export const FileInput = ({ label, accept, onChange }) => (
    <div>
        <label>{label}</label>
        <input type="file" accept={accept} onChange={onChange} />
    </div>
);

export const SelectInput = ({ label, value, options, onChange }) => (
    <div>
        <label>{label}</label>
        <select value={value} onChange={onChange}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);
export const TextInput = ({ label, value, onChange }) => (
    <div>
        <label>{label}</label>
        <input type="text" value={value} onChange={onChange} />
    </div>
);
