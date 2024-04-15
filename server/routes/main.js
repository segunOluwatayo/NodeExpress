const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
        title: 'Nodejs Blog',
        description: 'A Blog created using Nodejs and Express',
    }

    let perPage = 5;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});

/**
 * GET /
 * Contact
 */
router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});


function insertPostData () {
  Post.insertMany([
    {
      title: "Honoring Our Bodies: Nurturing Wellness from Within",
      body: "In a world often obsessed with external appearances, it’s easy to overlook the incredible marvel that is our own bodies. Our bodies are not just vessels that carry us through life; they are intricate systems of interconnected parts, each playing a vital role in our overall well-being. From the beating of our hearts to the complex workings of our brains, every aspect of our physical selves deserves recognition and care. One of the most beautiful aspects of our bodies is their resilience. Think about how your body heals a cut or mends a broken bone—it’s a testament to the amazing restorative powers we possess. However, this resilience isn’t unlimited, and it’s crucial to treat our bodies with the respect and care they deserve to maintain optimal health. Nurturing wellness starts from within. It’s about more than just eating right and exercising (though those are important, too!). It’s also about tuning in to what our bodies need on a deeper level—getting enough rest, managing stress, and fostering positive mental attitudes. These elements are like the pillars of a strong foundation upon which our overall health rests. Our bodies also have a language of their own, constantly communicating with us through signals like hunger, fatigue, pain, and pleasure. Learning to listen to these signals and respond appropriately is key to maintaining balance and harmony within ourselves. It’s important to remember that every body is unique, and what works for one person may not work for another. Embracing our individuality and respecting our body’s limits can help us cultivate a healthy relationship with ourselves. So, let’s take a moment to pause and appreciate the incredible gift that is our bodies. Let’s commit to treating them with kindness, nourishing them with wholesome foods, moving them joyfully, and giving them the rest they need. By honoring our bodies, we not only enhance our physical health but also nurture a deeper sense of well-being and self-love."
    },
    {
      title: "Embodied Wisdom: Exploring the Mind-Body Connection",
      body: "Have you ever stopped to marvel at the intricate dance between your mind and body? The connection between our mental and physical selves is a profound and often overlooked aspect of our overall well-being. In today’s fast-paced world, where stress and distractions abound, understanding and nurturing this mind-body connection can be a powerful tool for cultivating resilience and inner harmony. Our bodies are not separate entities from our minds; they are intimately intertwined, constantly exchanging information and influencing each other. Think about how your body reacts to stress—muscle tension, shallow breathing, racing heartbeat. These physical manifestations are direct responses to mental and emotional states. Conversely, engaging in activities that promote relaxation and mindfulness can lead to physical relaxation and a sense of calm. Exploring the mind-body connection goes beyond simple relaxation techniques. It involves delving into the rich tapestry of sensations, emotions, and thoughts that arise within us. Practices like yoga, meditation, tai chi, and mindfulness encourage us to pay attention to our bodies and minds in the present moment, fostering a deeper understanding of ourselves. Moreover, scientific research continues to uncover the profound impact of our mental state on physical health. Chronic stress, for example, has been linked to a range of health issues, from cardiovascular problems to weakened immune function. By managing stress through mind-body practices, we not only improve our mental well-being but also support our physical health. Cultivating a strong mind-body connection is a journey of self-discovery and self-care. It’s about learning to listen to our bodies’ signals, honoring our emotions without judgment, and finding practices that nourish both our minds and bodies. As we deepen this connection, we unlock a reservoir of embodied wisdom—a profound understanding of ourselves that guides us toward greater resilience, balance, and vitality in all aspects of life."
    },
    {
      title: "Tech Trends 2024: Exploring the Next Wave of Innovation",
      body: "As we step further into the digital age, the pace of technological advancement shows no signs of slowing down. The year 2024 promises to be a pivotal moment in tech evolution, with emerging trends poised to reshape industries and redefine how we interact with technology. Let’s dive into some of the most exciting developments on the horizon. 1. Artificial Intelligence (AI) Everywhere: AI is no longer confined to specialized applications—it’s permeating every aspect of our lives. From AI-powered personal assistants and chatbots to sophisticated machine learning algorithms driving business decisions, AI is becoming more integrated and accessible across sectors. 2. Extended Reality (XR) Experiences: Virtual reality (VR), augmented reality (AR), and mixed reality (MR) are converging into immersive XR experiences. Beyond gaming and entertainment, XR technologies are revolutionizing education, healthcare, architecture, and even remote collaboration, offering new ways to interact with digital content and environments. 3. Blockchain Beyond Cryptocurrency: While blockchain initially gained fame through cryptocurrencies, its potential goes far beyond digital currencies. Blockchain technology is transforming industries like supply chain management, healthcare records security, decentralized finance (DeFi), and digital identity verification, ushering in a new era of transparency and trust. 4. Edge Computing for Real-time Insights: With the explosion of IoT devices and data generation, edge computing brings processing power closer to the data source. This enables real-time analytics, reduced latency, and improved efficiency across industries such as manufacturing, autonomous vehicles, smart cities, and healthcare monitoring. 5. Sustainability-driven Tech Innovations: As environmental concerns take center stage, tech companies are focusing on sustainable practices and innovations. From energy-efficient data centers and renewable energy tech to eco-friendly materials in electronics, the tech industry is aligning with global efforts towards a greener future. 6. Quantum Computing on the Horizon: While still in its early stages, quantum computing holds immense promise for solving complex problems beyond the capabilities of classical computers. Expectations are high for breakthroughs in cryptography, material science, drug discovery, and optimization algorithms as quantum computing matures. The tech landscape of 2024 is dynamic and filled with opportunities for innovation and disruption. Embracing these trends requires not just technological prowess but also a keen understanding of ethical considerations, security challenges, and the societal impact of these advancements. Buckle up for an exhilarating journey into the future of tech!"
    },
    {
      title: "Embracing the Metaverse Revolution",
      body: "Step into a realm where digital fantasies meld with reality, where the virtual universe unfolds limitless possibilities—the Metaverse beckons. This new digital frontier is not just a playground for gamers but a sprawling landscape reshaping how we socialize, create, work, and experience life itself. In this vast expanse, boundaries blur as virtual worlds converge with augmented and virtual realities. Platforms like Decentraland, Roblox, and Fortnite are the pioneers, offering immersive spaces where individuals and businesses alike can forge new paths, from hosting virtual events to launching businesses in virtual realms. Central to the Metaverse allure is its burgeoning digital economy. Here, digital assets reign supreme, from unique NFT artworks to virtual real estate commanding real-world values. Creators find new avenues for expression, while entrepreneurs explore innovative business models within these dynamic, evolving ecosystems. Social interactions transcend screens, evolving into immersive experiences where avatars mingle, collaborate, and create in shared digital environments. Virtual conferences, concerts, and meetups blur geographical barriers, fostering connections and collaborations on a global scale. Yet, amidst this digital utopia, challenges loom large. Governance, privacy, security, and digital rights demand careful navigation. As the Metaverse expands, ensuring inclusivity, diversity, and responsible practices becomes imperative, shaping the ethical contours of this digital realm. The Metaverse isn’t just about entertainment; it's a canvas for creativity and learning. Virtual environments offer rich educational experiences, training simulations, and interactive showcases, revolutionizing how we approach education, skill development, and cultural preservation. As we embark on this Metaverse journey, let’s not just embrace the technological marvels but also uphold human values. Let’s build a Metaverse that fosters creativity, connectivity, diversity, and shared prosperity—a digital horizon where everyone can find their place and shape a brighter, more inclusive future together."
    },
    {
      title: "Green Tech Revolution: Pioneering Sustainability in a Digital Age",
      body: "Amidst growing environmental concerns, a new era of innovation is dawning—the Green Tech Revolution. At the intersection of technology and sustainability, visionary minds and cutting-edge solutions are paving the way towards a greener, more sustainable future. Let’s explore the transformative impact of green tech across various sectors and its promise for a brighter tomorrow. In the realm of energy, renewable technologies like solar, wind, and hydro power are no longer futuristic dreams but present-day realities. Advancements in energy storage, smart grids, and decentralized energy systems are driving the shift towards clean, renewable sources, reducing carbon footprints and mitigating climate change impacts. Transportation is undergoing a green makeover with electric vehicles (EVs) leading the charge. From sleek electric cars to eco-friendly public transport solutions, the transportation sector is embracing electrification and sustainable mobility options, reducing emissions and dependence on fossil fuels. The built environment is also witnessing green transformations. Green building practices, energy-efficient designs, and sustainable materials are not just buzzwords but integral elements of modern construction. From LEED-certified buildings to innovative eco-friendly architectures, sustainability is shaping the skylines of cities worldwide. In agriculture, precision farming technologies, vertical farming, and sustainable agricultural practices are revolutionizing food production. From reducing water usage and chemical inputs to optimizing crop yields, green tech innovations are not only promoting environmental stewardship but also ensuring food security for a growing global population. The digital realm itself is a catalyst for sustainability through concepts like circular economy models, IoT-enabled resource management, and data-driven sustainability analytics. Innovations in recycling technologies, waste management systems, and eco-conscious consumer choices are fostering a holistic approach towards a sustainable lifestyle. However, the journey towards sustainability isn’t without challenges. Collaborative efforts are needed to address issues like e-waste management, digital carbon footprints, and equitable access to green technologies across communities and regions. The Green Tech Revolution isn’t just about adopting new technologies; it’s a mindset shift towards responsible innovation and stewardship of our planet. By harnessing the power of green tech, we not only mitigate environmental risks but also unlock economic opportunities, enhance resilience, and create a more sustainable and equitable world for generations to come."
    },
    {
      title: "The Power of Connection: Nurturing Relationships in a Digital Age",
      body: "In an era defined by digital connectivity, the true essence of human connection often gets overshadowed by screens and notifications. Yet, amidst the technological buzz, fostering meaningful relationships remains as crucial as ever. Let’s delve into the art of nurturing connections in a digital age, exploring strategies to cultivate authentic relationships both online and offline. In our hyper-connected world, social media platforms, messaging apps, and virtual networks offer unprecedented opportunities to connect with others across the globe. From reconnecting with old friends to forming new professional networks, digital platforms have bridged geographical barriers, enabling us to expand our social circles and engage with diverse communities. However, the quantity of connections doesn’t always translate to quality relationships. Amidst likes, shares, and comments, it’s easy to lose sight of meaningful interactions. Building and maintaining authentic connections require intentionality, empathy, and genuine communication. One key aspect of nurturing relationships is active listening. In digital conversations filled with rapid exchanges and abbreviated messages, taking the time to listen attentively, understand perspectives, and respond thoughtfully fosters deeper connections and mutual understanding. Another vital element is empathy—the ability to put ourselves in others’ shoes and respond with compassion and understanding. Empathy bridges gaps, fosters trust, and strengthens bonds, whether in personal relationships, professional collaborations, or community interactions. Beyond digital interactions, investing time in face-to-face connections is invaluable. Shared experiences, meaningful conversations, and non-verbal cues enhance the richness of relationships, fostering emotional connections and building trust that transcends virtual spaces. It’s also important to set boundaries and prioritize meaningful connections amidst digital noise. Balancing online engagements with offline interactions, unplugging to focus on in-person connections, and cultivating hobbies and shared activities deepen relationships beyond virtual likes and comments. Moreover, leveraging technology to enhance, not replace, human connections is key. From scheduling virtual gatherings to using video calls for more personal interactions, technology can complement and enrich our relationships when used mindfully. As we navigate the digital age, let’s not forget the profound impact of authentic connections on our well-being, sense of belonging, and fulfillment. By cultivating empathy, active listening, meaningful interactions, and a healthy balance between digital and real-world connections, we nurture relationships that truly enrich our lives and communities."
    },
    {
      title: "Empowering Health: Innovations Shaping the Future of Medicine",
      body: "The landscape of healthcare is constantly evolving, propelled forward by groundbreaking innovations that revolutionize patient care, treatment methods, and medical research. Let’s explore the transformative power of cutting-edge technologies and practices that are shaping the future of medicine, ushering in an era of empowered health and well-being. Precision Medicine: Unleashing Personalized Care Precision medicine is redefining healthcare by tailoring treatments and interventions to individual genetic, environmental, and lifestyle factors. Advances in genomics, biomarker analysis, and data analytics enable healthcare providers to deliver targeted therapies, predict disease risks, and optimize treatment outcomes, ushering in a new era of personalized medicine. Telemedicine and Remote Care: Bridging Gaps in Access Telemedicine and remote care have emerged as vital tools, especially in times of global challenges such as pandemics. Virtual consultations, remote monitoring devices, and telehealth platforms connect patients with healthcare professionals regardless of geographical barriers, improving access to healthcare services, reducing wait times, and enhancing continuity of care. AI and Machine Learning: Augmenting Healthcare Expertise Artificial intelligence (AI) and machine learning algorithms are transforming healthcare delivery and decision-making processes. From diagnosing medical images and analyzing patient data to optimizing treatment plans and predicting disease trends, AI augments healthcare expertise, improves diagnostic accuracy, and enhances patient outcomes. Robotics and Minimally Invasive Surgery: Precision and Efficiency Robot-assisted surgeries and minimally invasive procedures are revolutionizing surgical practices. Robotic systems offer unparalleled precision, dexterity, and control, leading to smaller incisions, faster recovery times, and reduced risks for patients undergoing complex surgeries across various specialties. Digital Health and Wearable Technologies: Empowering Patient Engagement Digital health tools and wearable technologies empower individuals to take charge of their health and well-being. From fitness trackers monitoring activity levels to smart devices tracking vital signs and chronic conditions, these technologies promote proactive health management, early detection of health issues, and real-time feedback for patients and healthcare providers. Regenerative Medicine and Stem Cell Therapies: Healing and Regeneration Advancements in regenerative medicine and stem cell therapies hold promise for treating degenerative diseases, injuries, and chronic conditions. Stem cell research, tissue engineering techniques, and regenerative therapies aim to restore damaged tissues and organs, offering new hope for patients with conditions previously considered untreatable. As we embrace these transformative innovations, it’s crucial to uphold ethical standards, data privacy safeguards, and equitable access to cutting-edge healthcare technologies. By leveraging the power of innovation responsibly, healthcare providers, researchers, and patients can collaborate towards a future where personalized, accessible, and effective healthcare is within reach for all."
    },
    {
      title: "Engineering Frontiers: Pioneering Solutions for a Sustainable Tomorrow",
      body: "Engineering is not just about building structures or designing machines—it’s about crafting solutions that shape our world for the better. As we stand at the cusp of unprecedented challenges like climate change, resource scarcity, and urbanization, engineers are leading the charge towards a more sustainable and resilient future. Let’s delve into the innovative realms of engineering that are paving the way for tomorrow’s solutions. Renewable Energy Technologies: Harnessing Nature’s Power Engineers are at the forefront of harnessing renewable energy sources such as solar, wind, hydro, and geothermal power. Advancements in photovoltaic cells, wind turbine designs, energy storage systems, and smart grids are driving the transition towards clean, sustainable energy production, reducing reliance on fossil fuels and mitigating environmental impacts. Green Building and Sustainable Infrastructure: Balancing Form and Function In the realm of construction and infrastructure, sustainable engineering practices are reshaping urban landscapes. Green buildings with energy-efficient designs, passive cooling and heating systems, recycled materials, and smart technologies are not just eco-friendly but also cost-effective and comfortable for occupants, setting new standards for sustainable living and working spaces. Transportation Innovations: Moving Towards Zero Emissions Engineers are revolutionizing transportation with electric vehicles (EVs), high-speed railways, sustainable aviation technologies, and intelligent traffic management systems. From designing lightweight materials for fuel efficiency to developing electric charging infrastructure, engineering solutions are driving the shift towards zero-emission mobility and sustainable transportation networks. Water and Environmental Engineering: Safeguarding Earth’s Resources Water scarcity, pollution, and environmental degradation are global challenges that demand innovative engineering solutions. Engineers are developing water purification technologies, wastewater treatment systems, sustainable irrigation methods, and ecosystem restoration techniques to safeguard precious water resources, protect ecosystems, and promote environmental sustainability. Digitalization and Smart Technologies: Optimizing Efficiency and Resilience The integration of digital technologies such as IoT (Internet of Things), AI (Artificial Intelligence), data analytics, and automation is transforming industries and infrastructure systems. Smart cities, intelligent infrastructure monitoring, predictive maintenance, and optimized resource management empower engineers to enhance efficiency, reduce waste, and improve resilience in complex systems. Circular Economy and Waste Management: Rethinking Resource Consumption Engineers play a vital role in promoting circular economy principles, designing products, and systems for reuse, recycling, and resource recovery. Innovations in waste-to-energy technologies, sustainable packaging materials, and closed-loop manufacturing processes contribute to minimizing waste, conserving resources, and fostering a more sustainable approach to consumption and production. As engineers continue to push the boundaries of innovation, collaboration across disciplines, industries, and global borders becomes paramount. By embracing sustainable engineering practices, harnessing technological advancements responsibly, and prioritizing environmental and social impact, engineers are instrumental in creating a world where sustainability and progress go hand in hand."
    },
    {
      title: "NodeJs Limiting Network Traffic",
      body: "In today's interconnected digital landscape, managing network traffic efficiently is crucial for ensuring optimal performance and reliability of web applications. Node.js, with its asynchronous event-driven architecture, offers powerful tools and libraries for controlling and limiting network traffic effectively. Let’s delve into how Node.js empowers developers to handle network traffic intelligently and improve the overall user experience Understanding Network Traffic Management Before diving into implementation, it's essential to understand the importance of managing network traffic. Excessive traffic can lead to server overload, increased response times, and potential downtime, impacting user satisfaction and system stability. By implementing traffic management strategies, developers can mitigate these risks and optimize resource utilization. Rate Limiting with Express.js Middleware Node.js developers often leverage Express.js, a popular web application framework, for building robust APIs and web services. Express middleware offers a convenient way to implement rate limiting, where incoming requests are throttled based on predefined rules such as requests per minute or requests per IP address. By setting appropriate limits, developers can prevent abuse, enhance security, and maintain service reliability. Token Bucket Algorithm for Fine-grained Control For more granular control over traffic limits, the Token Bucket algorithm is a powerful tool. Node.js libraries such as express-rate-limit and ratelimiter implement this algorithm, allowing developers to define token replenishment rates, burst capacities, and custom rate-limiting rules. This approach enables fine-tuning of traffic limits based on specific application requirements and business logic. Distributed Rate Limiting with Redis In distributed environments or microservices architectures, maintaining consistent rate limits across multiple instances is challenging. Redis, a high-performance in-memory data store, offers solutions through its support for distributed rate limiting. By leveraging Redis along with Node.js libraries like express-rate-limit-redis, developers can implement scalable and synchronized rate limiting across clusters or microservices, ensuring uniform traffic management. Monitoring and Analytics for Insights Effective traffic management goes hand in hand with monitoring and analytics. Node.js applications can integrate with monitoring tools like Prometheus, Grafana, or custom logging solutions to track traffic patterns, detect anomalies, and gain insights into request rates, response times, and traffic distribution. These insights inform optimization efforts and help in making data-driven decisions for enhancing performance and scalability. By learning how to limit network traffic effectively in Node.js, developers can proactively manage resource usage, enhance system stability, mitigate security risks, and deliver a seamless user experience. Leveraging rate limiting strategies, algorithms, distributed systems, and monitoring tools empowers developers to optimize network traffic management and unlock the full potential of their Node.js applications in today's dynamic digital landscape."
    },
    {
      title: "Engineering Horizons: Innovating for a Sustainable Future",
      body: "Engineering is the heartbeat of progress, pulsating through every aspect of our modern world. It's the force that propels us towards a sustainable future, where ingenuity meets responsibility in crafting solutions that benefit humanity and the planet we call home. Exploring Aerospace Frontiers Aerospace engineering isn't just about reaching new heights; it's about redefining what's possible in air travel and space exploration. Engineers are designing advanced propulsion systems, lightweight materials, and innovative spacecraft that not only push boundaries but also prioritize fuel efficiency and environmental impact. Biomedical Marvels In the realm of biomedical engineering, marvels unfold daily. From life-saving medical devices and artificial organs to groundbreaking therapies like gene editing and regenerative medicine, engineers and medical professionals collaborate to improve healthcare outcomes and enhance quality of life worldwide. Renewable Energy Revolution Engineers are leading the charge in the renewable energy revolution, harnessing the power of the sun, wind, water, and earth to fuel our energy needs sustainably. Solar farms, wind turbines, hydropower plants, and energy storage solutions pave the way for a cleaner, greener future, reducing reliance on fossil fuels and mitigating climate change. Driving Mobility Innovation The automotive industry is undergoing a seismic shift towards electric and autonomous vehicles. Engineers are driving innovation in battery technology, autonomous driving algorithms, and smart infrastructure, revolutionizing how we commute, reducing emissions, and reimagining urban mobility. Building Sustainable Cities Civil and environmental engineers play a pivotal role in designing resilient and sustainable cities. Green buildings, smart infrastructure, water conservation systems, and efficient waste management solutions are transforming urban landscapes, promoting sustainability, and enhancing quality of life for urban dwellers. Securing Digital Frontiers In an era of digital interconnectedness, cybersecurity engineers are the guardians of our digital frontiers. From encryption technologies and biometric security to AI-driven threat detection systems, engineering solutions are vital in safeguarding data, networks, and digital ecosystems from cyber threats and ensuring privacy and trust in the digital age. Across these diverse engineering domains, a common thread binds them—a commitment to innovation that serves not just technological advancement but also societal well-being and environmental stewardship. Engineers stand as architects of a sustainable future, where creativity, responsibility, and progress converge to shape a world we can proudly pass on to future generations."
    },
  ])
}

insertPostData();


module.exports = router;