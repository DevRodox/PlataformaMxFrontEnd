import { useNavigate } from "react-router";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../../../assets/logodos.png";
import { useNewsData, useAdvertisement } from "../hooks";
import { Header, Footer, Banner, MainNews, SecondaryNews, MoreNewsCard } from "../components";

export const HomePage = () => {
  const { newsData, loading, error } = useNewsData();
  const { banner } = useAdvertisement();
  const navigate = useNavigate();

  const handleNewsClick = (slug) => {
    navigate(`/news/${slug}`);
  };

  const renderMainSection = () => {
    if (loading) {
      return <div className="text-center py-10">Cargando noticias...</div>;
    }

    if (error) {
      return <div className="text-center text-red-500 py-10">Error: {error}</div>;
    }

    if (!newsData || !newsData.slide || newsData.slide.length === 0) {
      return <div className="text-center py-10">No hay noticias disponibles</div>;
    }

    return (
      <>
        <div className="lg:hidden w-full mb-8 h-[320px]">
          <MainNews
            slides={newsData.slide}
            onNewsClick={(slug) => handleNewsClick(slug)}
          />
        </div>
        
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_1fr] gap-8 lg:gap-14 items-start max-w-7xl mx-auto">
          <div className="space-y-8">
            {newsData.secondNews.slice(0, 2).map((news) => (
              <SecondaryNews
                key={news.id}
                image={news.image}
                description={news.description}
                onClick={() => handleNewsClick(news.slug)}
              />
            ))}
          </div>

          <div className="hidden lg:block h-full">
            <div className="h-full flex">
              <MainNews
                slides={newsData.slide}
                onNewsClick={(slug) => handleNewsClick(slug)}
              />
            </div>
          </div>

          <div className="space-y-8">
            {newsData.secondNews.slice(2).map((news) => (
              <SecondaryNews
                key={news.id}
                image={news.image}
                description={news.description}
                onClick={() => handleNewsClick(news.slug)}
              />
            ))}
          </div>
        </section>
      </>
    );
  };

  const renderMoreNews = () => {
    if (!newsData || !newsData.more || newsData.more.length === 0) {
      return null;
    }

    return (
      <section className="mt-12 lg:mt-20 mb-16 lg:mb-28 px-4 sm:px-0 max-w-7xl mx-auto">
        <h2 className="text-black text-3xl sm:text-4xl lg:text-6xl font-semibold mb-6 lg:mb-10 select-none">
          Más Noticias
        </h2>
        <div className="relative">
          <div className="flex overflow-x-auto pb-6 lg:pb-8 space-x-6 px-2 scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-gray-100">
            {newsData.more.map((news) => (
              <MoreNewsCard
                key={news.id}
                image={news.image}
                description={news.description}
                onClick={() => handleNewsClick(news.slug)}
              />
            ))}
          </div>
        </div>
      </section>
    );
  };

 
const socialLinks = {
  facebook: "https://www.facebook.com/profile.php?id=61573717705519",
  //twitter: "https://twitter.com/tupagina",
  instagram: "https://www.instagram.com/_plataformanews?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  //youtube: "https://youtube.com/tupagina",
};

  return (
    <div className="flex flex-col min-h-screen">
      <Header logo={logo} />

       <main className="w-full px-5 lg:px-10 flex-grow">
      <div className="max-w-7xl mx-auto lg:mb-10">
          <Banner imageUrl={banner} />
        </div>
        {renderMainSection()}
        {renderMoreNews()}
      </main>

      <Footer logo={logo} socialLinks={socialLinks} />
    </div>
  );
};