import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow w-full max-w-[90rem] mx-auto px-6 py-10">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout;