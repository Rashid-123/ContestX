// app/components/Footer.js
export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white text-center p-4 mt-10">
            © {new Date().getFullYear()} MyWebsite. All Rights Reserved.
        </footer>
    );
}
