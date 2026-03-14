import React from 'react';
import '../style/table.css'; // וודאי שהקובץ קיים בתיקייה
import { useNavigate } from 'react-router-dom';
import { type CategoryDto } from '../types';

type Props<T> = {
    elements: T[];
    tableHeaders: string[];
    displayKeys: (keyof T)[];
    onDelete: (item: T) => void;
    onEdit: (item: T) => void;
    buttunAdd?: { text: string, function: () => void }
};

function GenericTable<T>({ elements, tableHeaders, displayKeys, onDelete, onEdit, buttunAdd }: Props<T>) {

    const headers = tableHeaders.map((header, i) => (
        <th key={i}>{header}</th>
    ))
    const rows = elements.map((item, rowIndex) =>
        <tr key={rowIndex} >
            {displayKeys.map((key, colIndex) => (
                <td
                    key={colIndex}
                    data-label={tableHeaders[colIndex]}
                    className={colIndex === 0 ? "main-cell" : ""}
                >
                    {item[key] !== null && item[key] !== undefined && item[key] !== ""
                        ? String(item[key])
                        : <span className="empty-val">---</span>}
                </td>
            ))}
            <td data-label="פעולות" className="actions-cell">
                {!(rowIndex == 0 && 'songsCount' in (item as any)) && //בשביל שלא יוכלו למחוק את הקטגוריה הבסיסית
                    <div className="flex-actions">
                        <button onClick={() => onEdit(item)} className="icon-btn edit" title="עריכה">✎</button>
                        <button onClick={() => onDelete(item)} className="icon-btn delete" title="מחיקה">🗑</button>
                    </div>}
                {(rowIndex == 0 && 'songsCount' in (item as any)) && //בשביל שלא יוכלו למחוק את הקטגוריה הבסיסית
                    <div className="flex-actions">
                        אי אפשר למחוק או לערוך
                    </div>}
            </td>

        </tr>
    )

    return (
        <div className='btnAndTabl'>
            {buttunAdd?.text && <button className='btnAdd material-symbols-outlined' onClick={buttunAdd.function}>{buttunAdd.text}</button>}
            <div className="table-container">
                <div className="responsive-table">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                {headers}
                                <th className="actions-column">פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                    {elements.length === 0 && <div className="empty-state">אין נתונים להצגה</div>}
                </div>
            </div>
        </div>

    );
};

export default GenericTable;