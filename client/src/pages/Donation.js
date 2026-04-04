import React from 'react';
import './assets/css/donation.css';

const Donation = () => {
  const donations = [
    {
      title: 'Centre for Science and Environment (CSE)',
      description:
        'CSE is a public interest research and advocacy organization based in New Delhi that works on sustainable development, air pollution, water management, and climate change awareness.',
      link: 'https://www.cseindia.org/',
    },
    {
      title: 'GiveIndia – Climate & Environment Fund',
      description:
        'GiveIndia supports multiple NGOs working on reforestation, clean energy, and environmental conservation across India. Donations help communities adapt to climate change.',
      link: 'https://www.giveindia.org/fundraisers/climate-and-environment',
    },
    {
      title: 'Sankalptaru Foundation',
      description:
        'Sankalptaru is an Indian NGO that plants trees across the country. You can donate to plant trees in your name, track their growth, and help offset carbon emissions.',
      link: 'https://sankalptaru.org/',
    },
    {
      title: 'Isha Foundation – Cauvery Calling',
      description:
        'An initiative by Sadhguru’s Isha Foundation to revitalize rivers through tree-based agriculture and sustainable water management.',
      link: 'https://www.ishaoutreach.org/en/cauvery-calling',
    },
  ];

  const resources = [
    {
      link: 'https://www.indiawaterportal.org/',
      title: 'India Water Portal',
    },
    {
      link: 'https://www.cseindia.org/',
      title: 'CSE Climate Resources',
    },
    {
      link: 'https://carbonfootprintindia.org/',
      title: 'Carbon Footprint India – Measurement & Awareness',
    },
  ];

  return (
    <main className="donation-main">
      <div>
        <h1 className="donation-title">
          Looking for more ways to help the environment?
        </h1>
        <h2 className="donate">Support India’s fight against climate change</h2>
        <div className="donation">
          {donations.map(({ title, link, description }) => (
            <div className="donation-card" key={title}>
              <h4 className="donation-card-title">{title}</h4>
              <p>{description}</p>
              <a href={link} target="_blank" rel="noreferrer">
                <button type="submit">Donate Now</button>
              </a>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="resource">Learn more about sustainability in India</h2>
        <div className="resources">
          {resources.map(({ link, title }) => (
            <a key={title} href={link} target="_blank" rel="noreferrer">
              <button type="submit">{title}</button>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Donation;
