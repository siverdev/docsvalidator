import { useState } from "react";

const NameForm = () => {
    const [fullName, setFullName] = useState("");
    const [fullNameError, setFullNameError] = useState(false);

    const formatFullName = (name) => {
        return name
            .trim()
            .replace(/\s{2,}/g, ' ') 
            .replace(/\s+$/, '')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const validateFullName = (name) => {
        const fullNamePattern = /^[А-ЯЁІЇЄҐ][а-яёіїєґ]+\s[А-ЯЁІЇЄҐ][а-яёіїєґ]+\s[А-ЯЁІЇЄҐ][а-яёіїєґ]+$/;
        return fullNamePattern.test(name);
    };

    const handleChange = (e) => {
        setFullName(e.target.value);
    };

    return (
        <div className="flex flex-col mb-4">
            <label className="mb-2" htmlFor="fullName">ПІБ власника щоденника:</label>
            <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={handleChange}
                placeholder="Василенко Іван Андрійович"
                className={`w-100 p-2 border rounded-lg focus:outline-none focus:ring-2 ${fullNameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-500 focus:ring-blue-500'}`}
            />
        </div>
    );
};

export default NameForm;
