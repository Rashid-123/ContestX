// app/components/Footer.js
// export default function Footer() {
//     return (
//         <footer className="bg-gray-800 text-white text-center p-4 mt-10">
//             © {new Date().getFullYear()} MyWebsite. All Rights Reserved.
//         </footer>
//     );
// }


// app/components/Footer.js
import { Github, Linkedin, Twitter, ExternalLink, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-16 border-t border-gray-700">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Main content */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    {/* Developer info */}
                    <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">About This Project</h3>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                            Hi, I'm Rashid. I built this platform to help developers get personalized LeetCode problem recommendations based on their solving patterns.
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-400">
                                Found a bug? Feel free to reach out!
                            </span>
                        </div>
                    </div>

                    {/* Social links */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Social Icons */}
                        <div>
                            <h4 className="text-white font-medium mb-3 text-sm">Connect</h4>
                            <div className="flex gap-6">
                                <a
                                    href="https://www.linkedin.com/in/shadan-rashid/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                    aria-label="LinkedIn Profile"
                                >
                                    <Linkedin className="w-6 h-6" />
                                </a>
                                <a
                                    href="https://x.com/Rashid1505"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                    aria-label="Twitter Profile"
                                >
                                    <Twitter className="w-6 h-6" />
                                </a>
                                <a
                                    href="https://github.com/Rashid-123"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                    aria-label="GitHub Profile"
                                >
                                    <Github className="w-6 h-6" />
                                </a>
                            </div>
                        </div>

                        {/* Project Repository */}
                        <div>
                            <h4 className="text-white font-medium mb-3 text-sm">Source Code</h4>
                            <a
                                href="https://github.com/Rashid-123/Next_Step"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
                            >
                                <Github className="w-4 h-4" />
                                <span>View Repository</span>
                                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mt-4 pt-6">

                    <p className="text-sm text-gray-500 text-align-center ">
                        © {new Date().getFullYear()} NextStep. Built with ❤️
                    </p>


                </div>
            </div>
        </footer>
    );
}