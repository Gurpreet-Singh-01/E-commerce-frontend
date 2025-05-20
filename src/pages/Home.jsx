import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col font-text bg-surface">
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="relative h-[90vh] bg-cover bg-center flex flex-col items-center justify-center gap-5 text-secondary"
          style={{ backgroundImage: "url('/main-hero-2.png')" }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-logo">
            Power Up Your Devices
          </h2>
          <h2 className="text-3xl md:text-5xl font-bold font-logo">With</h2>
          <h1 className="text-5xl md:text-7xl font-bold font-logo">TechTrendz</h1>
          <Link to="/products">
            <Button
              size="large"
              className="mt-6 border border-secondary text-secondary hover:bg-transparent hover:text-secondary active:scale-95 transition-all duration-300"
            >
              Shop Now
            </Button>
          </Link>
        </section>

        {/* Product Sections */}
        <section className="container mx-auto px-4 py-12 flex flex-col gap-16">
          {/* High-Speed Chargers */}
          <div className="flex flex-col md:flex-row items-center justify-around p-10 gap-8">
            <div
              className="w-full md:w-1/2 aspect-[4/3] bg-cover bg-center"
              style={{ backgroundImage: "url('/hero-charger.jpg')" }}
            ></div>
            <div className="w-full md:w-[35vw] flex flex-col gap-4">
              <h2 className="text-3xl md:text-5xl font-bold font-headings text-neutral-dark mt-6 md:mt-12 mb-8">
                High-Speed Chargers
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold font-logo text-neutral mb-4">
                Power up with our USB-C fast chargers, designed for efficiency.
              </h3>
              <p className="text-lg text-neutral">Features sleek designs</p>
              <p className="text-lg text-neutral">30W fast charging</p>
              <p className="text-lg text-neutral">Durable cables.</p>
              <Link to="/products">
                <Button
                  size="medium"
                  className="mt-6 text-neutral border border-neutral hover:text-neutral-dark hover:bg-transparent active:scale-95"
                >
                  Charge Up Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Stylish Phone Covers */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-around p-10 gap-8">
            <div
              className="w-full md:w-1/2 aspect-[4/3] bg-cover bg-center"
              style={{ backgroundImage: "url('/hero-cover.jpg')" }}
            ></div>
            <div className="w-full md:w-[35vw] flex flex-col gap-4">
              <h2 className="text-3xl md:text-5xl font-bold font-headings text-neutral-dark mt-6 md:mt-12 mb-8">
                Stylish Phone Covers
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold font-logo text-neutral mb-4">
                Protect your device with our premium Apple and Samsung covers.
              </h3>
              <p className="text-lg text-neutral">Showcases vibrant designs</p>
              <p className="text-lg text-neutral">Camera protection</p>
              <p className="text-lg text-neutral">Slim fit.</p>
              <Link to="/products">
                <Button
                  size="medium"
                  className="mt-6 text-neutral border border-neutral hover:text-neutral-dark hover:bg-transparent active:scale-95"
                >
                  Explore Covers
                </Button>
              </Link>
            </div>
          </div>

          {/* Immersive Headphones */}
          <div className="flex flex-col md:flex-row items-center justify-around p-10 gap-8">
            <div
              className="w-full md:w-1/2 aspect-[4/3] bg-cover bg-center"
              style={{ backgroundImage: "url('/hero-headphone.jpg')" }}
            ></div>
            <div className="w-full md:w-[35vw] flex flex-col gap-4">
              <h2 className="text-3xl md:text-5xl font-bold font-headings text-neutral-dark mt-6 md:mt-12 mb-8">
                Immersive Headphones
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold font-logo text-neutral mb-4">
                Experience sound like never before with our wired and wireless earbuds.
              </h3>
              <p className="text-lg text-neutral">Offers noise cancellation</p>
              <p className="text-lg text-neutral">Deep bass</p>
              <p className="text-lg text-neutral">Sleek finish</p>
              <Link to="/products">
                <Button
                  size="medium"
                  className="mt-6 text-neutral border border-neutral hover:text-neutral-dark hover:bg-transparent active:scale-95"
                >
                  Listen Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Ergonomic Keyboards */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-around p-10 gap-8">
            <div
              className="w-full md:w-1/2 aspect-[4/3] bg-cover bg-center"
              style={{ backgroundImage: "url('/hero-keyboard.jpg')" }}
            ></div>
            <div className="w-full md:w-[35vw] flex flex-col gap-4">
              <h2 className="text-3xl md:text-5xl font-bold font-headings text-neutral-dark mt-6 md:mt-12 mb-8">
                Ergonomic Keyboards
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold font-logo text-neutral mb-4">
                Type in style with our mechanical and wireless keyboards.
              </h3>
              <p className="text-lg text-neutral">Features RGB lighting</p>
              <p className="text-lg text-neutral">Tactile switches</p>
              <p className="text-lg text-neutral">Minimalist design</p>
              <Link to="/products">
                <Button
                  size="medium"
                  className="mt-6 text-neutral border border-neutral hover:text-neutral-dark hover:bg-transparent active:scale-95"
                >
                  Type in Style
                </Button>
              </Link>
            </div>
          </div>


          <div className="flex flex-col md:flex-row items-center justify-around p-10 gap-8">
            <div
              className="w-full md:w-1/2 aspect-[4/3] bg-cover bg-center"
              style={{ backgroundImage: "url('/hero-mouse.jpg')" }}
            ></div>
            <div className="w-full md:w-[35vw] flex flex-col gap-4">
              <h2 className="text-3xl md:text-5xl font-bold font-headings text-neutral-dark mt-6 md:mt-12 mb-8">
                Precision Mice
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold font-logo text-neutral mb-4">
                Navigate effortlessly with our wired and wireless mice.
              </h3>
              <p className="text-lg text-neutral">Includes RGB accents</p>
              <p className="text-lg text-neutral">Ergonomic grip</p>
              <p className="text-lg text-neutral">High-precision sensors</p>
              <Link to="/products">
                <Button
                  size="medium"
                  className="mt-6 text-neutral border border-neutral hover:text-neutral-dark hover:bg-transparent active:scale-95"
                >
                  Click to Discover
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;