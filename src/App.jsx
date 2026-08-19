import { useEffect, useRef, useState } from "react";
import "./App.css";

import hero01 from "./assets/wedding/hero-01.jpeg";
import hero02 from "./assets/wedding/hero-02.jpeg";
import hero03 from "./assets/wedding/hero-03.jpeg";
import hero04 from "./assets/wedding/hero-04.jpeg";

import real01 from "./assets/wedding/real-01.JPG";
import real02 from "./assets/wedding/real-02.JPG";
import real03 from "./assets/wedding/real-03.JPG";
import real04 from "./assets/wedding/real-04.JPG";

const heroImages = [hero01, hero02, hero03, hero04];

const weddingPhotos = import.meta.glob(
  "./assets/wedding/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const getSectionPhotos = (folder) => {
  return Object.entries(weddingPhotos)
    .filter(([path]) => path.includes(`/wedding/${folder}/`))
    .sort(([pathA], [pathB]) =>
      pathA.localeCompare(pathB, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    )
    .map(([, image]) => image);
};

const weddingSections = [
  {
    title: "The Bride",
    subtitle: "Celebrating Krupali",
    images: getSectionPhotos("bride"),
  },
  {
    title: "The Groom",
    subtitle: "Celebrating Parth",
    images: getSectionPhotos("groom"),
  },
  {
    title: "The Family",
    subtitle: "The people who make it special",
    images: getSectionPhotos("family"),
  },
  {
    title: "The Ceremony",
    subtitle: "The beginning of forever",
    images: getSectionPhotos("ceremony"),
  },
  {
    title: "Wedding Memories",
    subtitle: "Friends, family & unforgettable moments",
    images: getSectionPhotos("memories"),
  },
  {
    title: "Haldi",
    subtitle: "Colour, laughter & celebration",
    images: getSectionPhotos("haldi"),
  },
  {
    title: "Pooja",
    subtitle: "Blessings for the journey ahead",
    images: getSectionPhotos("pooja"),
  },
  {
    title: "Reception",
    subtitle: "Celebrating the newlyweds",
    images: getSectionPhotos("reception"),
  },
  {
    title: "Other Memories",
    subtitle: "Everything else worth remembering",
    images: getSectionPhotos("other"),
  },
];
function PhotoRow({ section }) {
  const [page, setPage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const touchStartX = useRef(null);
  const [zoom, setZoom] = useState(1);

const handleTouchStart = (event) => {
  touchStartX.current = event.touches[0].clientX;
};

const handleTouchEnd = (event) => {
  if (touchStartX.current === null) return;

  const touchEndX = event.changedTouches[0].clientX;
  const distance = touchStartX.current - touchEndX;

  if (Math.abs(distance) > 50) {
    if (distance > 0) {
      nextPhoto();
    } else {
      previousPhoto();
    }
  }

  touchStartX.current = null;
};
const handleWheelZoom = (event) => {
  event.preventDefault();

  setZoom((current) => {
    const next = event.deltaY < 0
      ? current + 0.2
      : current - 0.2;

    return Math.min(Math.max(next, 1), 3);
  });
};

  const photosPerPage = 5;
  const totalPages = Math.max(
    1,
    Math.ceil(section.images.length / photosPerPage)
  );

  const startIndex = page * photosPerPage;

  const visiblePhotos = section.images.slice(
    startIndex,
    startIndex + photosPerPage
  );

  const nextPage = () => {
    setPage((current) => Math.min(current + 1), totalPages - 1);
  };

  const previousPage = () => {
  setPage((current) => Math.max(current - 1, 0));
};

  const openPhoto = (index) => {
    setSelectedIndex(startIndex + index);
  };

  const closePhoto = () => {
    setSelectedIndex(null);
  };

  const previousPhoto = () => {
    setSelectedIndex((current) =>
      current === 0 ? section.images.length - 1 : current - 1
    );
  };

  const nextPhoto = () => {
    setSelectedIndex((current) =>
      current === section.images.length - 1 ? 0 : current + 1
    );
  };
 

  return (
    <>
      <section className="photo-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">MEMORIES</p>
            <h2>{section.title}</h2>
            <p>{section.subtitle}</p>
          </div>

          {totalPages > 1 && (
  <div className="row-controls">
    {page > 0 && (
      <button
        type="button"
        className="see-more-button"
        onClick={previousPage}
      >
        ← Go back
      </button>
    )}

    {page < totalPages - 1 && (
      <button
        type="button"
        className="see-more-button"
        onClick={nextPage}
      >
        See more →
      </button>
    )}
  </div>
)}

        </div>

        <div className="photo-row">
          {visiblePhotos.map((image, index) => (
            <button
              className="photo-card"
              key={`${section.title}-${startIndex + index}`}
              type="button"
              onClick={() => openPhoto(index)}
              aria-label={`View ${section.title} photo ${
                startIndex + index + 1
              }`}
            >
              <img
                src={image}
                alt={`${section.title} memory ${
                  startIndex + index + 1
                }`}
              />
              <span>View memory</span>
            </button>
          ))}
        </div>
      </section>

      {selectedIndex !== null && (
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${section.title} photo viewer`}
          onClick={closePhoto}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={closePhoto}
            aria-label="Close photo viewer"
          >
            ×
          </button>

          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              previousPhoto();
            }}
            aria-label="Previous photo"
          >
            ←
          </button>

          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheelZoom}
          >          
           <img
             src={section.images[selectedIndex]}
             alt={`${section.title} memory ${
                selectedIndex + 1
               }`}
             style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.15s ease"
                    }}
            />

            <a
              className="lightbox-download"
              href={section.images[selectedIndex]}
              download
              onClick={(event) => event.stopPropagation()}
            >
              Download Photo
            </a>
          </div>

          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              nextPhoto();
            }}
            aria-label="Next photo"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}

function App() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/music/wedding-theme.mp3");
    audio.loop = true;
    audio.volume = 0.45;

    audioRef.current = audio;
        audio.play()
      .then(() => {
        setIsMusicPlaying(true);
      })
      .catch(() => {
        // Browser blocked autoplay.
        // The Play Music button remains available.
      });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsMusicPlaying(true);
      } catch (error) {
        console.error("Unable to play wedding music:", error);
      }
    }
  };
      useEffect(() => {
      const handleScroll = () => {
        const hero = document.querySelector(".hero");

        if (!hero) return;

        const heroBottom = hero.getBoundingClientRect().bottom;

        if (heroBottom < 100 && audioRef.current && isMusicPlaying) {
          audioRef.current.pause();
          setIsMusicPlaying(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [isMusicPlaying]);
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const scrollToMemories = () => {
    document.getElementById("memories")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="wedding-site">
      <section className="hero">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`hero-slide ${
              index === heroIndex ? "hero-slide-active" : ""
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        <div className="hero-overlay" />

        <header className="site-header">
          <div className="brand">K &amp; P</div>

          <nav>
            <button type="button" onClick={scrollToMemories}>
              Memories
            </button>
            <button type="button">Share Photos</button>
          </nav>
        </header>

        <div className="hero-content">
          <p className="hero-kicker">A WEDDING TO REMEMBER</p>

          <h1>
            Krupali
            <span>&amp;</span>
            Parth
          </h1>

          <div className="hero-divider">
            <span />
            <b>♥</b>
            <span />
          </div>

          <p className="hero-subtitle">Our Wedding Memories</p>

          <button
            type="button"
            className="explore-button"
            onClick={scrollToMemories}
          >
            Explore Memories
            <span>↓</span>
          </button>
                <button
        type="button"
        className={`music-button ${isMusicPlaying ? "music-playing" : ""}`}
        onClick={toggleMusic}
        aria-label={isMusicPlaying ? "Pause wedding music" : "Play wedding music"}
      >
        <span className="music-icon">
          {isMusicPlaying ? "♫" : "♪"}
        </span>
        <span>
          {isMusicPlaying ? "Music On" : "Play Music"}
        </span>
      </button>
        </div>

        <div className="hero-dots">
          {heroImages.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === heroIndex ? "active" : ""}
              onClick={() => setHeroIndex(index)}
              aria-label={`Show hero image ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="intro" id="memories">
        <p className="section-eyebrow">WELCOME</p>

        <h2>A collection of moments, memories and love.</h2>

        <p>
          From the first preparations to the ceremony and every celebration
          around it, this is our little corner of the wedding story.
        </p>
      </section>

      <div className="sections-container">
        {weddingSections.map((section) => (
          <PhotoRow key={section.title} section={section} />
        ))}
      </div>

      <section className="shared-memories">
        <div className="shared-content">
          <p className="section-eyebrow">FROM OUR GUESTS</p>

          <h2>Memories Shared by Family &amp; Friends</h2>

          <p>
            Were you there with us? Share the moments you captured and help us
            make this collection even more special.
          </p>

          <div className="guest-collections">
            <button className="guest-card">
              <span className="guest-icon">✦</span>
              <strong>Photos from Kamlesh</strong>
              <small>Coming soon</small>
            </button>

            <button className="guest-card">
              <span className="guest-icon">✦</span>
              <strong>Memories from Family</strong>
              <small>Coming soon</small>
            </button>

            <button className="guest-card">
              <span className="guest-icon">✦</span>
              <strong>Friends &amp; Guests</strong>
              <small>Coming soon</small>
            </button>
          </div>

          <button className="share-button" type="button">
            📸 Share Your Photos
          </button>

          <p className="approval-note">
            All guest submissions are reviewed before appearing on the site.
          </p>
        </div>
      </section>

      <footer>
        <div className="footer-monogram">K &amp; P</div>
        <p>Made with love for Krupali &amp; Parth</p>
        <span>♥</span>
      </footer>
    </main>
  );
}

export default App;