import React from "react";
import { Link } from "react-router-dom";

// CreditCard component with avatar and LinkedIn button
const CreditCard = ({ name, role, description, imageUrl, linkedin }) => (
  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl text-center transform hover:scale-105 transition-transform duration-300 border border-white/10">
    {/* Avatar image */}
    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-amber-500">
      <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-xl font-bold text-cyan-300">{name}</h3>
    <p className="text-yellow-300 font-semibold mb-2">{role}</p>
    <p className="text-gray-300 text-sm mb-4">{description}</p>

    {linkedin && (
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        LinkedIn
      </a>
    )}
  </div>
);

export default function AboutScreen() {
  // Example team data
  const figmaDesigners = [
    {
      name: "Rimjhim",
      role: "UI/UX & Figma Designer",
      description: "CSE 5B",
      imageUrl: "/images/avatarfp.png",
      linkedin: "https://www.linkedin.com/in/rimjhim-verma-599447290",
    },
    {
      name: "Lavanya",
      role: "UI/UX & Figma Designer",
      description: "CSE 5B",
      imageUrl: "/images/avatar2.png",
      linkedin: "https://www.linkedin.com/in/lavanya-pulani-a46421283",
    },
    {
      name: "Somya",
      role: "UI/UX & Figma Designer",
      description: "CSE 5B",
      imageUrl: "/images/avatar3.png",
      linkedin: "https://www.linkedin.com/in/somya-prabhakar-b64759285/",
    },
    {
      name: "Vaishnavi",
      role: "UI/UX & Figma Designer",
      description: "CSE 5B",
      imageUrl: "/images/avatar4.jpg",
      linkedin: "https://www.linkedin.com/in/vaishnavi-profile",
    },
  ];

  const coLeads = [
    {
      name: "Vikas Sharma",
      role: "Co-Lead & App Developer",
      description: "CSE 6B",
      imageUrl: "/images/vik.png",
      linkedin: "https://www.linkedin.com/in/vikas-sharma0b/",
    },
    {
      name: "Harsh Vardhan",
      role: "Co-Lead & App Developer",
      description: "CSE 6B",
      imageUrl: "/images/avatarhv.png",
      linkedin:
        "http://www.linkedin.com/in/harsh-vardhan-kumar-mishra-24364a24b",
    },
  ];

  // const coreTeam = [
  //   {
  //     name: "Your Name",
  //     role: "Project Lead & Lead Developer",
  //     description:
  //       "Built the core logic, backend APIs, and integrated the riddles.",
  //     imageUrl: "/images/lead.jpg",
  //     linkedin: "https://www.linkedin.com/in/your-profile",
  //   },
  // ];

  return (
    <div className="relative bg-gradient-to-br from-[#131826] via-[#1f2937] to-[#111827] min-h-screen text-white p-6">
      {/* Floating gradient glow shapes */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-60 h-60 bg-gradient-to-tr from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

      <div className="relative max-w-5xl mx-auto z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-yellow-300 mb-2">
            Meet the Team
          </h1>
          <p className="text-lg text-gray-300">
            A project brought to life by creative minds and passionate
            developers.
          </p>
        </header>

        {/* Designers */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-6 text-center">
            ✨ Designers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {figmaDesigners.map((member) => (
              <CreditCard
                key={member.name}
                name={member.name}
                role={member.role}
                description={member.description}
                imageUrl={member.imageUrl}
                linkedin={member.linkedin}
              />
            ))}
          </div>
        </section>

        {/* Co-leads */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-6 text-center">
            🤝 Co-Leads
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coLeads.map((member) => (
              <CreditCard
                key={member.name}
                name={member.name}
                role={member.role}
                description={member.description}
                imageUrl={member.imageUrl}
                linkedin={member.linkedin}
              />
            ))}
          </div>
        </section>

        {/* Core team */}
        {/* <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 mb-6 text-center">
            💪 Core Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreTeam.map((member) => (
              <CreditCard
                key={member.name}
                name={member.name}
                role={member.role}
                description={member.description}
                imageUrl={member.imageUrl}
                linkedin={member.linkedin}
              />
            ))}
          </div>
        </section> */}

        {/* Back button */}
        <div className="text-center mt-16">
          <Link
            to="/"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-xl transition-transform hover:scale-105"
          >
            ← Back to Welcome Screen
          </Link>
        </div>
      </div>
    </div>
  );
}
