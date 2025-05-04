import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


const AuditorInitial = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFade(true);
  //     setTimeout(() => {
  //       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  //       setFade(false);
  //     }, 500);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <main className="container-fluid">

      {/* Welcome Section */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Welcome Back Auditor</h1>
        <p className="lead text-justify">
          Effortlessly monitor and review all foreign exchange card transactions with clarity and control.
          Stay informed about every transaction and ensure compliance with financial regulations to maintain transparency and security in global markets.
        </p>
      </div>

      {/* Features Section */}
      <div className="container-fluid">
        <div className="row text-center">
          {[
            { title: "Monitor Transactions", text: "Gain full visibility into all forex card transactions with detailed logs, allowing auditors to track discrepancies and ensure accurate financial reporting." },
            { title: "Exchange Rate Insights", text: "Stay updated with real-time currency exchange rates and market trends, providing auditors with critical insights for evaluating forex transactions." },
            { title: "Data Security & Compliance", text: "Ensure safe, encrypted transactions while maintaining global compliance standards, protecting financial institutions and users from fraud." },
          ].map((card, index) => (
            <div
              className="col-md-4 mb-4"
              key={index}
            >
              <div
                className="card h-100 shadow-lg rounded"
                style={{
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div
                  className="card-body"
                  style={{
                    background: "royalblue",
                    color: "white",
                    borderRadius: "5px",
                    transition: "background-color 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e90ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "royalblue")}
                >
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text text-justify">{card.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Content Sections */}
      <section className="mt-5 mx-auto text-center">
        <h2 className="text-center">Audit Process Overview</h2>
        <p className="text-muted text-justify">
          The audit process ensures financial accuracy by identifying risks, verifying transaction records, and testing compliance with banking regulations.
          Auditors analyze forex transactions to detect irregularities, validate exchange rate calculations, and prepare reports that improve monitoring strategies.
        </p>
      </section>

      <section className="mt-5 mx-auto text-center">
        <h2 className="text-center">Latest Forex Trends</h2>
        <p className="text-muted text-justify">
          Advancements in forex auditing include AI-driven fraud detection, stricter regulatory oversight, and increased cryptocurrency adoption in forex markets.
          Auditors now evaluate blockchain transactions to ensure legal compliance while leveraging automated tools for risk assessment.
        </p>
      </section>

      <section className="mt-5 mb-5 mx-auto text-center">
        <h2 className="text-center">User Testimonials & Case Studies</h2>
        <p className="text-muted text-justify">
          Financial institutions have successfully prevented fraud through rigorous forex auditing.
          One case study highlights an AI-powered compliance system that flagged a $250,000 scam, allowing auditors to intervene and secure the transaction.
          Clients appreciate advanced monitoring systems for ensuring safer transactions.
        </p>
      </section>
    </main>
  );
};

export default AuditorInitial;