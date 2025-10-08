import React, { useState, KeyboardEvent } from 'react';
import XIcon from '../icons/XIcon';
import UserPlusIcon from '../icons/UserPlusIcon';

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    label: string;
    id: string;
    placeholder: string;
    disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, label, id, placeholder, disabled }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue) {
            e.preventDefault();
            removeTag(tags.length - 1);
        }
    };

    const removeTag = (indexToRemove: number) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };
    
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const newTags = pastedText.split(/[,;\n]+/).map(tag => tag.trim()).filter(Boolean);
        if (newTags.length > 0) {
            const uniqueNewTags = newTags.filter(tag => !tags.includes(tag));
            setTags([...tags, ...uniqueNewTags]);
        }
    };


    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className={`flex flex-wrap items-center gap-2 p-2 bg-slate-900 border border-slate-700 rounded-lg focus-within:ring-2 focus-within:ring-amber-400 transition-shadow duration-200 ${disabled ? 'opacity-50' : ''}`}>
                <UserPlusIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                {tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-sm font-semibold px-2 py-1 rounded">
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-amber-300 hover:text-white disabled:opacity-50"
                            aria-label={`Remove ${tag}`}
                            disabled={disabled}
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    id={id}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder={placeholder}
                    className="flex-grow p-1 bg-transparent focus:outline-none min-w-[120px]"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default TagInput;
