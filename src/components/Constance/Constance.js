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
