
import { useState } from 'react'
import '../style/footer.css'
// import DropDown from './dropDown'

function Footer() {
    const links = ['מעצבים', 'מתכנתים', 'מבשלים']
    const nweLinks = links.map(link => (
        <a href="">{link}</a>
    ))

    return (
        <div className="footer">
            <div className="rightFooter">
                <h3>לינקים חשובים</h3>
                {nweLinks}
            </div>
            {/* <DropDown/> */}
            <div className="leftFooter">
                <ConnecteionForm />
            </div>
        </div>
    )
}

export default Footer

function ConnecteionForm() {

    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value, }));
    };

    // שליחת טופס
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(formData); // כאן שולחים לשרת בעתיד
        // איפוס טופס
        setFormData({
            name: "",
            email: "",
            message: "",
        });
    };

    return (
        <>
            <h3>יצירת קשר</h3>
            <form onSubmit={handleSubmit} className="contact-form">
                
                <input
                    type="text"
                    name="name"
                    placeholder="שם"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="אימייל"
                    value={formData.email}
                    onChange={handleChange}
                />

                <textarea
                    name="message"
                    placeholder="תוכן ההודעה"
                    value={formData.message}
                    onChange={handleChange}
                />

                <button type="submit">שליחה</button>
            </form>
        </>

    );
}