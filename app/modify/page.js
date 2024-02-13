import Image from "next/image";
import Navbar from "../components/Navbar";
import Modify from "./Modify";
export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <div className="mt-12 sm:px-16 px-6 py-4 max-w-[1440px] mx-auto">
        <Modify />
      </div>
    </main>
  );
}
