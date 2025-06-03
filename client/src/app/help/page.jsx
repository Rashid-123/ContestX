
import { HelpCircle } from "lucide-react";
import { FaTwitter, FaLinkedin, FaHandshake } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export default function Help() {

    return (
        <div className="container mx-auto px-4 py-8  flex flex-col gap-4  max-w-[900px]">
            <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-700 mb-4">
                <HelpCircle className="h-6 w-6 mr-2" />
                Help & Support
            </h2>

            <div className="bg-white p-5 sm:p-6 md:p-6 rounded-xl border border-gray-200 shadow-xs  transition-all duration-300 hover:shadow-sm">

                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    Provide Feedback
                </h2>
                <div className="space-y-2 mb-3">
                    <p className=" text-sm " style={{ color: 'var(--second-text-color)' }}>
                        Hello! I am Rashid developer of this app. If you have any feedback, suggestions, or issues, please feel free to reach out to me. I would love to hear from you !
                    </p>
                    <p className="mb-5 text-sm flex items-center flex-wrap gap-2" style={{ color: 'var(--second-text-color)' }}>
                        Connect with me on :

                        <a
                            href="https://www.linkedin.com/in/shadan-rashid/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-500 mx-2"
                        >
                            LinkedIn <FaLinkedin className="w-5 h-5" />
                        </a>

                        <a
                            href="https://x.com/Rashid1505"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-700"
                        >
                            Twitter <FaTwitter className="w-5 h-5" />
                        </a>
                    </p>

                </div>
                <div className="flex flex-col gap-3">
                    <div>  <label htmlFor="name" className="text-sm font-semibold text-gray-1000 ">Your Name</label>
                        <input id="name" type="text" placeholder="Enter Your Name" className="mt-1 w-full p-2 text-sm placeholder:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all "

                        /></div>
                    <div>  <label htmlFor="email" className="text-sm font-semibold text-gray-1000">Email Address</label>
                        <input id="email" type="email" placeholder="Enter Your Email" className="mt-1 w-full p-2  text-sm placeholder:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all
                        "/></div>

                    <div> <label htmlFor="message" className="text-sm font-semibold text-gray-1000">Message</label>
                        <textarea id="message" placeholder="Share your question, feedback, or any issue you're facing..."
                            rows="6" className="mt-1 w-full p-2 text-sm placeholder:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all 
                        "></textarea></div>

                </div>
                <div ><button className="w-full my-3 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">Submit Request</button></div>

                <div className="border border-gray-200 p-4 text-sm rounded-xl flex items-center justify-center text-center space-x-2">
                    <HiOutlineExclamationCircle className="w-6 h-6 text-yellow-500" />
                    <span className="text-gray-800">Your message is forwarded directly to my email. I'll get back to you via email as soon as possible.</span>
                </div>
            </div>

        </div >

    );
}