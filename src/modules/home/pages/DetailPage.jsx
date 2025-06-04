  import { useNavigate, useParams } from 'react-router';
  import { useEffect } from 'react';
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import logo from '../../../assets/logodos.png';
  import { useNewsDetails, useRelatedNews, useAdvertisement } from '../hooks';
  import { Header, Footer, Banner } from '../components';

  export const DetailPage = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { newsDetail, loading, error } = useNewsDetails(slug);
    const { relatedNews } = useRelatedNews(slug);
    const { banner } = useAdvertisement();

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
    };

    const handleRelatedArticleClick = (articleSlug) => {
      navigate(`/news/${articleSlug}`);
    };

    if (loading) {
      return (
        <>
          <Header logo={logo} />
          <div className="text-center py-10">Cargando...</div>
          <Footer logo={logo} />
        </>
      );
    }

    if (error || !newsDetail) {
      return (
        <>
          <Header logo={logo} />
          <div className="text-center text-red-500 py-10">
            {error || "Noticia no encontrada"}
          </div>
          <Footer logo={logo} />
        </>
      );
    }

    const socialLinks = {
    facebook: "https://www.facebook.com/profile.php?id=61573717705519",
    //twitter: "https://twitter.com/tupagina",
    instagram: "https://www.instagram.com/_plataformanews?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    //youtube: "https://youtube.com/tupagina",
  };

    useEffect(() => {
      if (!newsDetail) return;

      const metas = [
        { property: 'og:title', content: newsDetail.title },
        { property: 'og:description', content: newsDetail.content[0] || '' },
        { property: 'og:image', content: newsDetail.images[0] },
        { property: 'og:author', content: newsDetail.author },
      ];

      metas.forEach(({ property, content }) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      });

      return () => {
        metas.forEach(({ property }) => {
          const el = document.querySelector(`meta[property="${property}"]`);
          if (el) document.head.removeChild(el);
        });
      };
    }, [newsDetail]);

    return (
      <>
        <Header logo={logo} />

        <main className="w-full px-4 sm:px-6 md:px-10 lg:px-20 md:space-y-10 max-w-7xl mx-auto">
          <Banner imageUrl={banner} />

          <section className="mb-4 md:mb-6 bg-gray-100 rounded-xl md:rounded-3xl p-5 md:p-11">
            <h2 className="font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-6xl leading-snug md:leading-tight">
              {newsDetail.title}
            </h2>
          </section>

          <section className="mb-6 flex flex-col md:flex-row gap-6 md:gap-10">
            <article className="w-full md:w-2/3">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 md:mb-8 lg:mb-14 gap-2 md:gap-4">
                <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-light">
                  Por {newsDetail.author} | {newsDetail.date}
                </p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold">
                  {newsDetail.category}
                </p>
              </div>

              <div className="w-full">
                {newsDetail.images.map((img, idx) => (
                  <div key={idx} className="mb-6 md:mb-10">
                    <img 
                      alt={`Imagen ${idx + 1}`} 
                      className="w-full h-auto min-h-[200px] sm:min-h-[300px] md:min-h-[400px] object-cover rounded-lg md:rounded-3xl mb-4 md:mb-6"
                      src={img}
                      onError={handleImageError}
                    />
                    {newsDetail.content[idx] && (
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-loose px-1 sm:px-0">
                        {newsDetail.content[idx]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </article>

            {relatedNews && relatedNews.length > 0 && (
              <aside className="w-full md:w-1/3 my-6 md:my-12 lg:my-24">
                <div className="bg-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 mb-5 md:mb-10 text-left inline-block text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700">
                  Leer Más:
                </div>

                <div className="hidden md:block">
                  {relatedNews.slice(0, 5).map((article, index) => (
                    <div 
                      key={index} 
                      className="flex gap-4 mb-5 items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      onClick={() => handleRelatedArticleClick(article.slug)}
                    >
                      <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0 rounded-md overflow-hidden relative">
                        <img 
                          alt={article.title} 
                          className="w-full h-full object-cover rounded-md hover:scale-110 transition-transform duration-300"
                          src={article.image} 
                          onError={handleImageError}
                        />
                      </div>
                      <p className="text-xs md:text-sm lg:text-base leading-tight flex-grow">
                        {article.title}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="md:hidden relative w-full">
                  <div className="flex overflow-x-auto pb-6 space-x-4 px-0 scrollbar scrollbar-thumb-amber-500">
                    {relatedNews.slice(0, 5).map((article, index) => (
                      <article 
                        key={`mobile-${index}`} 
                        className="flex-shrink-0 w-[250px] bg-black rounded-xl overflow-hidden relative h-[250px]"
                        onClick={() => handleRelatedArticleClick(article.slug)}
                      >
                        <img
                          className="w-full h-full object-cover rounded-xl hover:scale-110 transition-transform duration-300"
                          src={article.image}
                          alt={article.title}
                          onError={handleImageError}
                        />
                        <p className="text-white text-sm p-3 absolute bottom-0 left-0 right-0 bg-black/50 leading-tight">
                          {article.title}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </section>
        </main>

        <Footer logo={logo} socialLinks={socialLinks} />
      </>
    );
  };