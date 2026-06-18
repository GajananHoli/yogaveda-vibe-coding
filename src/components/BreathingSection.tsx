import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Wind, BookOpen, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

interface WeeklyStatItem {
  day: string;
  minutes: number;
  sessions: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 dark:bg-slate-950 p-3 rounded-2xl border border-orange-100/10 shadow-xl text-xs font-sans text-white">
        <p className="font-semibold text-slate-300">{payload[0].payload.day + "day"}</p>
        <p className="text-[#FF7A00] font-bold mt-1">
          Practice: {payload[0].value} mins
        </p>
        <span className="text-slate-400 block mt-0.5">
          Sessions completed: {payload[0].payload.sessions}
        </span>
      </div>
    );
  }
  return null;
};

interface BreathingSectionProps {
  t: Record<string, string>;
  currentLang?: string;
}

interface PranayamaTechnique {
  id: string;
  names: Record<string, { main: string; alt: string }>;
  descriptions: Record<string, string>;
  benefits: Record<string, string[]>;
  precautions: Record<string, string[]>;
  instructions: Record<string, string[]>;
  ratio: {
    inhale: number;
    hold: number;
    exhale: number;
    empty: number;
  };
  style: string; // Tailwind bg color class
}

const PRANAYAMA_DATA: PranayamaTechnique[] = [
  {
    id: "nadi-shodhana",
    names: {
      en: { main: "Nadi Shodhana", alt: "Alternate Nostril Breathing" },
      hi: { main: "नाड़ी शोधन", alt: "अनुलोम विलोम प्राणायाम" },
      mr: { main: "नाडी शोधन", alt: "अनुलोम विलोम प्राणायाम" },
      gu: { main: "નાડી શોધન", alt: "અનુલોમ વિલોમ પ્રાણાયામ" }
    },
    descriptions: {
      en: "A purifying breath control practice that harmonizes the left and right hemispheres of the brain, calms the mind, and neutralizes daily anxiety.",
      hi: "एक शुद्धिकरण प्राणायाम जो मस्तिष्क के बाएं और दाएं गोलार्ध को संतुलित करता है, मन को शांत करता है और मानसिक तनाव को दूर करता है।",
      mr: "एक शुद्धीकरण प्राणायाम जो मेंदूच्या डाव्या आणि उजव्या भागाला संतुलित करतो, मन शांत करतो आणि ताणतणाव नाहीसा करतो.",
      gu: "એક શુદ્ધિકરણ પ્રાણાયામ જે મગજના ડાબા અને જમણા ભાગમાં સંતુલન લાવે છે, મનને શાંત કરે છે અને ચિંતા મુક્ત કરે છે."
    },
    benefits: {
      en: [
        "Unblocks energetic channels (Nadis)",
        "Reduces stress, lowers heart rate, and boosts cardiovascular stamina",
        "Improves cognitive attention and spatial memory",
        "Balances sympathetic and parasympathetic nervous systems"
      ],
      hi: [
        "ऊर्जा चैनलों (नाड़ियों) के अवरोध दूर करता है",
        "तनाव कम करता है, हृदय गति मन नियंत्रित करता है",
        "एकाग्रता और मानसिक स्पष्टता को बढ़ाता है",
        "सहानुभूति तथा परानुकंपी तंत्रिका तंत्र में संतुलन लाता है"
      ],
      mr: [
        "ऊर्जा नलिकांमधील (नाड्यांमधील) अडथळे दूर करतो",
        "तणाव कमी करतो आणि हृदय गती नियंत्रित करतो",
        "एकाग्रता आणि मानसिक स्पष्टता वाढवतो",
        "मज्जासंस्थेमध्ये उत्तम समन्वय घडवून आणतो"
      ],
      gu: [
        "ઊર્જા પથો (નાડીઓ) ના અવરોધો દૂર કરે છે",
        "તણાવ ઓછો કરે છે અને હૃદય મનને શાંત રાખે છે",
        "માનસિક એકાગ્રતા અને યાદશક્તિ વધારે છે",
        "ચેતાતંત્રમાં સુંદર સંતુલન સ્થાપે છે"
      ]
    },
    precautions: {
      en: [
        "Avoid retaining breath too long if you have high blood pressure or cardiac concerns.",
        "Perform with a relaxed face; do not squeeze or strain the nostrils.",
        "Should not be practiced with blocked nasal airways or cold."
      ],
      hi: [
        "यदि आपको उच्च रक्तचाप या हृदय रोग है, तो सांस को अधिक समय तक न रोकें।",
        "चेहरे की मांसपेशियों को ढीला रखें; नाक पर अधिक दबाव न डालें।",
        "नाक पूरी तरह से बंद होने या गंभीर सर्दी में इसका अभ्यास न करें।"
      ],
      mr: [
        "जर तुम्हाला उच्च रक्तदाब किंवा हृदयाचा त्रास असेल, तर श्वास जास्त वेळ रोखू नका.",
        "चेहऱ्यावर ताण न आणता अत्यंत हलक्या हाताने नाकावर बोटे ठेवा.",
        "नाक पूर्ण बंद असताना किंवा सर्दी असताना सराव टाळावा."
      ],
      gu: [
        "જો તમને હાઈ બ્લડપ્રેશર અથવા હૃદયની તકલીફ હોય, તો શ્વાસ વધારે સમય ન રોકવો.",
        "ચહેરાના સ્નાયુઓ હળવા રાખો; નાક પર વધુ દબાણ ન આપવું.",
        "નાક સાવ બંધ હોય કે શરદી હોય ત્યારે અભ્યાસ ટાળવો."
      ]
    },
    instructions: {
      en: [
        "Adopt Vishnu Mudra with your right hand (curl index and middle fingers to the palm).",
        "Sit comfortably with your spine erect and shoulders dropped lower.",
        "Close your right nostril with your thumb. Inhale deep and quiet through your left nostril.",
        "Close left nostril with your ring finger. Release right nostril and exhale slow and warm.",
        "Inhale again through the right nostril, close it, and exhale smoothly through the left nostril.",
        "This completes one full serene round of purification. Keep the cycle rhythmic."
      ],
      hi: [
        "दाहिने हाथ से विष्णु मुद्रा धारण करें (तर्जनी और मध्यमा अंगुलियों को हथेली की ओर मोड़ें)।",
        "रीढ़ की हड्डी को सीधा और कंधों को ढीला रखकर आरामदायक मुद्रा में बैठें।",
        "अंगूठे से दाहिनी नासिका बंद करें। बाईं नासिका से गहरी और शांत सांस लें।",
        "अनामिका से बाईं नासिका बंद करें। दाहिनी नासिका खोलें और धीरे-धीरे सांस बाहर छोड़ें।",
        "अब दाहिनी नासिका से गहरी सांस लें, इसे बंद करें, और बाईं नासिका से धीरे-धीरे सांस छोड़ें।",
        "यह नाड़ी शोधन का एक चक्र पूरा करता है। चक्र को लयबद्ध और शांत रखें।"
      ],
      mr: [
        "उजव्या हाताने विष्णू मुद्रा धारण करा (तर्जनी आणि मध्यमा तळहाताकडे दुमडा).",
        "पाठ सरळ ठेवून आणि खांदे सैल ठेवून ध्यानस्थ बसावी.",
        "उजव्या अंगठ्याने उजवी नाकपुडी बंद करा. डाव्या नाकपुडीने खोल श्वास घ्या.",
        "अनामिकेने डावी नाकपुडी बंद करा, उजवी नाकपुडी उघडून श्वास हळूवार सोडा.",
        "आता उजव्या नाकपुडीने श्वास घ्या, ती बंद करा, आणि डाव्या नाकपुडीने श्वास सावकाश बाहेर सोडा.",
        "हे नाडी शोधन प्राणायामाचे एक संपूर्ण आवर्तन पूर्ण करते."
      ],
      gu: [
        "જમણા હાથથી વિષ્ણુ મુદ્રા લો (તર્જની અને મધ્યમા આંગળીઓને હથેળી તરફ વાળો).",
        "ટટ્ટાર પીઠ અને ખભા હળવા રાખી આરામદાયક આસને બેસો.",
        "જમણા અંગૂઠાથી જમણું નસકોરું બંધ કરો. ડાબા નસકોરાથી ઊંડો અને શાંત શ્વાસ લો.",
        "અનામિકાથી ડાબું નસકોરું બંધ કરો. જમણું નસકોરું ખોલી શાંતિથી શ્વાસ બહાર કાઢો.",
        "હવે જમણા નસકોરાથી શ્વાસ લો, તેને બંધ કરો, અને ડાબા નસકોરાથી શ્વાસ ધીમેથી બહાર કાઢો.",
        "આ પ્રાણાયામનું એક પૂર્ણ વર્તુળ પૂરું કરે છે. શ્વાસની લય સમાન રાખો."
      ]
    },
    ratio: { inhale: 4, hold: 4, exhale: 4, empty: 4 },
    style: "from-amber-500/10 to-orange-500/20 text-orange-700 dark:text-orange-400"
  },
  {
    id: "sama-vritti",
    names: {
      en: { main: "Sama Vritti", alt: "Equal Ratio Box Breathing" },
      hi: { main: "सम वृत्ति", alt: "चतुष्कोण श्वास क्रिया (Box Breathing)" },
      mr: { main: "सम वृत्ती", alt: "समान गुणोत्तर श्वसन (Box Breathing)" },
      gu: { main: "સમ વૃત્તિ", alt: "સમતા શ્વાસ ક્રિયા (Box Breathing)" }
    },
    descriptions: {
      en: "A highly structured, clinical breathing ratio used by athletic champions and elite forces to ground thoughts and create mental laser focus.",
      hi: "मन को केंद्रित करने और घबराहट को तुरंत दूर करने के लिए एथलीटों और ध्यानियों द्वारा उपयोग किया जाने वाला एक समान अनुपात श्वास अभ्यास।",
      mr: "विचार शांत करण्यासाठी आणि प्रचंड मानसिक एकाग्रता मिळवण्यासाठी खेळाडू आणि योगाभ्यासी द्वारे केली जाणारी समान श्वसन पद्धत.",
      gu: "મનને એકાગ્ર કરવા અને ગભરામણ તરત જ ઓછી કરવા માટે રમતવીરો દ્વારા ઉપયોગમાં લેવાતી શ્વાસની સમાન ગુણોત્તર ક્રિયા."
    },
    benefits: {
      en: [
        "Instantly lowers cortisol and balances blood pressure",
        "Regulates breathing depth and re-energizes vital tissue",
        "Creates calm space inside high-stakes dynamic conditions",
        "Improves lung volume and general emotional resilience"
      ],
      hi: [
        "कोर्टिसोल का स्तर घटाता है और तुरंत रक्तचाप नियंत्रित करता है",
        "श्वास की गहराई को बढ़ाके शरीर के अंगों को पुनर्जीवित करता है",
        "अत्यधिक मानसिक तनाव की स्थिति में त्वरित शांति प्रदान करता है",
        "फेफड़ों की वायु संचय क्षमता और संवेगात्मक संवेदनशीलता सुधारता है"
      ],
      mr: [
        "कोर्टिसोल कमी करतो आणि रक्तदाब त्वरित संतुलित राखतो",
        "श्वासाची खोली नियंत्रित करतो आणि अवयवांना नवी ऊर्जा देतो",
        "अत्यंत चिंतेच्या क्षणी मनाला तात्काळ स्थिर करतो",
        "फुफ्फुसांची ताकद आणि भावनिक लवचिकता वाढवण्यास मदत करतो"
      ],
      gu: [
        "કોર્ટિસોલ ઘટાડે છે અને બ્લડપ્રેશરને તાત્કાલિક શાંત કરે છે",
        "શ્વાસની ઊંડાઈ વધારે છે અને શરીરના કોષોને સક્રિય કરે છે",
        "તણાવભરી પરિસ્થિતિમાં મનને સત્વરે સ્થિર કરે છે",
        "ફેફસાંની ક્ષમતા અને આંતરિક મનોબળ સુધારે છે"
      ]
    },
    precautions: {
      en: [
        "Keep the retention gentle; release or skip holds if you feel any dizziness.",
        "Prathyahara: Keep eyes closed to prevent visual distractions.",
        "Practice on an empty stomach for maximum energetic benefit."
      ],
      hi: [
        "सांस रोककर रखने की क्रिया को सहज रखें; चक्कर आने पर सांस रोकना छोड़ दें।",
        "प्रत्याहार: ध्यान को बाहरी बाधाओं से बचाने के लिए आंखें बंद रखें।",
        "अत्यधिक लाभ के लिए खाली पेट इसका अभ्यास करें।"
      ],
      mr: [
        "श्वास रोखून धरण्याची क्रिया सोयीस्कर ठेवा; चक्कर आल्यासारखे वाटल्यास थांबवा.",
        "प्रत्याहार: बाह्य अडथळे टाळण्यासाठी डोळे बंद ठेवा.",
        "जास्तीत जास्त ऊर्जेसाठी रिकाम्या पोटी सराव करा."
      ],
      gu: [
        "શ્વાસ રોકવાની ક્રિયા વધુ ખેંચવી નહીં; ચક્કર લાગે તો તરત સામાન્ય શ્વાસ લેવો.",
        "પ્રત્યાહાર: ચિત્ત સ્થિર કરવા માટે આંખો બંધ રાખો.",
        "પૂર્ણ લાભ લેવા માટે આ ક્રિયા ખાલી પેટે કરવી હિતવાહ છે."
      ]
    },
    instructions: {
      en: [
        "Sit upright in a cross-legged posture, palms dry and open upward on knees.",
        "Exhale all air completely through both nostrils.",
        "Inhale steadily as the visual expansion guide expands (4 seconds).",
        "Hold your breath inside with chest wide and throat relaxed (4 seconds).",
        "Exhale slowly, letting the air slide warmly out (4 seconds).",
        "Hold the lungs fully empty, resting in the absolute void (4 seconds)."
      ],
      hi: [
        "पद्मासन या सुखासन में बैठें, हथेलियों को घुटनों पर ऊपर की ओर खुला रखें।",
        "अपनी दोनों नासिकाओं से पूरी हवा बाहर निकालें।",
        "चक्र के विस्तार के साथ-साथ ४ सेकंड तक धीरे-धीरे और समान रूप से सांस लें।",
        "फेफड़ों के भीतर हवा को ४ सेकंड के लिए आराम से रोककर रखें (कुंभक)।",
        "४ सेकंड तक हवा को धीरे-धीरे बाहर निकालते हुए फेफड़ों को खाली करें।",
        "बिना सांस लिए खाली फेफड़ों की अवस्था में ४ सेकंड तक शांत बने रहें।"
      ],
      mr: [
        "सुखासनात बसून आपल्या हातांचे तळवे गुडघ्यांवर वरच्या बाजूला उघडे ठेवावे.",
        "नाकावाटे फुफ्फुसातील संपूर्ण हवा बाहेर सोडा.",
        "मार्गदर्शकाच्या सूचनेनुसार ४ सेकंद संतत गतीने श्वास आत घ्या.",
        "४ सेकंद फुफ्फुसांमध्ये हवा शांतपणे रोखून धरा (अंतर् कुंभक).",
        "४ सेकंद कालावधीत हळू हळू श्वास पूर्णपणे बाहेर सोडा (रेचक).",
        "४ सेकंद पूर्णपणे श्वास न घेता रिकाम्या अवस्थेत स्थिर राहा (बाह्य कुंभक)."
      ],
      gu: [
        "સુખાસનમાં ટટ્ટાર બેસીને બંને હાથ ગુણધ્યાન મુદ્રામાં ઘૂંટણ પર રાખો.",
        "નસકોરા દ્વારા ફેફસાંની તમામ હવા સંપૂર્ણ બહાર કાઢો.",
        "વર્તુળના આકાર વધવાની સાથે સાથે ૪ સેકન્ડ સુધી શ્વાસ અંદર ભરો.",
        "૪ સેકન્ડ માટે શ્વાસને અંદર રોકી રાખો (અંતઃ કુંભક).",
        "૪ સેકન્ડ સુધી શ્વાસ ધીમે ધીમે બહાર છોડો (રેચક).",
        "૪ સેકન્ડ શ્વાસ લીધા વિના ખાલી અવસ્થામાં આરામ અનુભવો (બાહ્ય કુંભક)."
      ]
    },
    ratio: { inhale: 4, hold: 4, exhale: 4, empty: 4 },
    style: "from-rose-500/10 to-red-600/15 text-rose-700 dark:text-rose-400"
  },
  {
    id: "bhramari",
    names: {
      en: { main: "Bhramari", alt: "Humming Bee Pranayama" },
      hi: { main: "भ्रामरी प्राणायाम", alt: "गुंजन श्वसन (Humming Bee)" },
      mr: { main: "भ्रामरी प्राणायाम", alt: "गुंजन श्वसन क्रिया" },
      gu: { main: "ભ્રામરી પ્રાણાયામ", alt: "મધપૂડો ગુંજન શ્વાસ" }
    },
    descriptions: {
      en: "This simple but deeply tranquil vibration activates a positive chemical resonance inside your cerebral tissues, dropping stress metrics in minutes.",
      hi: "एक मधुर गुंजन श्वसन तकनीक जो मस्तिष्क के ऊतकों में सकारात्मक कंपन पैदा करती है, क्रोध, चिंता और उच्च रक्तचाप को तुरंत शांत करती है।",
      mr: "एक नादमय श्वसन प्रकार जो डोक्यामध्ये कंपने निर्माण करतो, ज्यामुळे राग, नैराश्य व अंतर्गत ताण त्वरित शांत होऊन गाढ झोप लागण्यास मदत होते.",
      gu: "એક દૈવી કંપન પેદા કરતો પ્રાણાયામ જે મગજના કોષોને ઉત્તેજિત કરી તણાવ, ક્રોધ અને અતિ ઉત્તેજના સત્વરે શાંત પાડે છે."
    },
    benefits: {
      en: [
        "Releases cerebral nitric oxide, encouraging cellular healing and oxygen perfusion",
        "Calms emotional agitation and builds an internal bubble of sound and focus",
        "Highly recommended for relieving insomnia and restoring peaceful sleep patterns",
        "Reduces mental chatter, enabling a smooth bridge directly to meditation"
      ],
      hi: [
        "मस्तिष्क को आराम देने वाले यौगिकों और नाइट्रिक ऑक्साइड के स्राव को बढ़ाता है",
        "भावनात्मक अशांति और अत्यधिक विचारों को रोककर एकाग्रता बढ़ाता है",
        "अनिद्रा (Insomnia) से मुक्ति पाने और गहरी नींद के लिए अत्यंत प्रभावशाली",
        "मानसिक बकवास को शांत करके ध्यान (Meditation) का मार्ग प्रशस्त करता है"
      ],
      mr: [
        "मेंदूला शांत करणाऱ्या संप्रेरकांचे रक्ताभिसरण सुधारतो",
        "मानसिक आणि भावनिक अस्वस्थतेला संपूर्ण दूर करतो",
        "शांत झोप येण्यासाठी आणि अनिद्रा आजारावर मात करण्यासाठी उत्तम ठरतो",
        "मनातील नको असलेले विचार कमी करून ध्यान लावण्यास साह्य करतो"
      ],
      gu: [
        "મગજને તણાવમુકત કરતા નાઇટ્રિક ઓક્સાઇડના સ્ત્રાવમાં વધારો કરે છે",
        "ભાવનાત્મક ચિડચીડાપણું અને ઊંડા વિચારોને દૂર કરી શાંતિ બક્ષે છે",
        "અનિદ્રાની તકલીફથી પીડાતા સાધકો માટે ઉત્તમ પ્રાણાયામ છે",
        "મનના ફાલતુ વિચારો અટકાવી ધ્યાનની ઊંડી અવસ્થામાં સરકવા માટે સક્ષમ બનાવે છે"
      ]
    },
    precautions: {
      en: [
        "Do not insert finger deeply or press forcefully inside the ear canal. Rest fingers on tragus lightly.",
        "Practice with dental arches held apart slightly—do not clench teeth.",
        "Always perform with gentle, effortless humming; do not strain your throat."
      ],
      hi: [
        "उंगलियों को कान के छेद में बहुत गहराई या जोर से न डालें। केवल बाहरी कार्टिलेज पर हल्के से दबाव दें।",
        "दांतों को आपस में सटाकर न रखें, जबड़े को थोड़ा ढीला रखें।",
        "गुंजन की आवाज बहुत सहज और प्राकृतिक होनी चाहिए; गले पर अनावश्यक दबाव न डालें।"
      ],
      mr: [
        "बोटे कानाच्या छिद्रामध्ये खूप जास्त जोरात घालू नका, फक्त कानाच्या बाहेरील पडद्यावर स्पर्श करा.",
        "जबडे आणि दात घट्ट आवळून धरू नका.",
        "घशावर कोणतीही जबरदस्ती न करता सुलभ आणि संथ गुंजन काढावे."
      ],
      gu: [
        "આંગળીઓ કાનમાં જોરથી ન ઘુસાડવી, માત્ર બહારના કાનના નરમ ભાગને હળવાથી દબાવવો.",
        "દાંત વચ્ચે સહેજ જગ્યા રાખો, દાંત ભીડવા નહીં.",
        "ગુંજન ખૂબ જ સાહજિક અને મોહક હોવું જોઈએ; ગળા પર કોઈ સોજો કે ખેંચાણ ન દેખાવવું."
      ]
    },
    instructions: {
      en: [
        "Sit comfortably in a quiet space, spine long, shoulders sliding down.",
        "Raise your elbows to shoulder height and close your ears with your thumbs.",
        "Place your index fingers on brow-ridges, and other fingers resting gently on eyes and face (Shanmukhi Mudra).",
        "Inhale fully and gently through both nostrils (4 seconds).",
        "Exhale slowly while producing a warm, steady, low-pitched humming sound like a bee (8 seconds).",
        "Feel the vibrational waves soothing your brain cells. Rest inside the resonance."
      ],
      hi: [
        "शांत जगह पर सीधे बैठें, रीढ़ सीधी रखें और कंधों को आरामदायक रखें।",
        "कोहनियों को कंधों की सीध में उठाएं और अंगूठों से दोनों कानों को हल्के से बंद करें।",
        "तर्जनी उंगलियों को भौंहों के ऊपर रखें और शेष उंगलियों को हल्के से आंखों और चेहरे पर रखें (शांभवी/षण्मुखी मुद्रा)।",
        "दोनों नासिकाओं से ४ सेकंड तक आराम से गहरी सांस लें।",
        "८ सेकंड तक सांस छोड़ते हुए मुंह बंद रखें और गले से 'म' शब्द का भौंरे जैसा गुंजन करें।",
        "इस सुखद कंपन को मस्तिष्क के भीतर महसूस करें और उसमें लीन हो जाएं।"
      ],
      mr: [
        "शांत वातावरणात ताठ बसावे, पाठीचा कणा सरळ ठेवा.",
        "कोपर खांद्यांच्या समांतर रेषेत वर उचलून दोन अंगठ्यांनी कान हलकेच बंद करा.",
        "षण्मुखी मुद्रेचा सराव करण्यासाठी हाताची बोटे चेहरा व डोळ्यांवर अत्यंत नाजूक ठेवावीत.",
        "४ सेकंद व्यवस्थित नाकाने श्वास आत भरून घ्यावा.",
        "८ सेकंद तोंड बंद ठेवून श्वास सोडताना भुंग्यासारखा संथ आणि खोल 'म्म्म्...' गुंजन आवाज काढा.",
        "हा नाद मेंदूला स्पर्श करून शांत करत असल्याचे अनुभवा."
      ],
      gu: [
        "એકાંત જગ્યાએ ટટ્ટાર આસને બેસો અને પાછળની પીઠ ટટ્ટાર રાખો.",
        "બંને કોણીઓને ખભા સમાંતર ઊંચી કરો અને અંગૂઠાથી કાન હળવા બંધ કરો.",
        "તર્જની આંગળી ભમર પર અને અન્ય આંગળીઓ નમ્રતાપૂર્વક આંખો આસપાસ રાખો (ષણ્મુખી મુદ્રા).",
        "નસકોરા દ્વારા ૪ સેકન્ડ સુધી શાંતિથી પૂરતો શ્વાસ અંદર ભરો.",
        "૮ સેકન્ડ સુધી શ્વાસ બહાર કાઢતી વખતે મોં બંધ રાખીને ગળામાંથી ભમરા જેવો 'મ...' ગુજાર કરો.",
        "આ દૈવી કંપનોને મગજ અને ખોપરીની અંદર પ્રસરતા અનુભવો."
      ]
    },
    ratio: { inhale: 4, hold: 4, exhale: 8, empty: 0 },
    style: "from-saffron-500/10 to-yellow-500/20 text-amber-700 dark:text-amber-400"
  },
  {
    id: "ujjayi",
    names: {
      en: { main: "Ujjayi Pranayama", alt: "The Ocean Victorous Breath" },
      hi: { main: "उज्जायी प्राणायाम", alt: "समुद्री लहर श्वसन (Ocean Breath)" },
      mr: { main: "उज्जायी प्राणायाम", alt: "विजयी श्वास (Victorious Breath)" },
      gu: { main: "ઉજ્જાયી પ્રાણાયામ", alt: "વિજયી મહા શ્વાસ (Ocean Breath)" }
    },
    descriptions: {
      en: "By lightly constricting your glottis, you convert standard breath into a rhythmic ocean whisper, stimulating the vagus nerve and calming the heart.",
      hi: "कंठ को थोड़ा संकुचित करके लिया जाने वाला समुद्री श्वास, जो वेगस तंत्रिका को उत्तेजित करता है और मन को गहरी अंतर्मुखी शांति प्रदान करता है।",
      mr: "घशातील स्वरयंत्र किंचित आकुंचन पावून केले जाणारे खोल श्वसन, ज्यामुळे समुद्रातील लाटांसारखा नाद निघतो व मन विलक्षण शांत होते.",
      gu: "ગળાને સહેજ સંકોચીને લેવાતો સમુદ્રી શ્વાસ, જે વેગસ ચેતાને જાગૃત કરે છે અને હૃદયના ધબકારાને અત્યંત હળવા કરે છે."
    },
    benefits: {
      en: [
        "Warm air cleanses and moisturizes incoming breath, protecting target lungs",
        "Activates the vagus nerve to reduce blood pressure and muscular stiffness",
        "Synchronizes breath with mental intent, heating the core system safely",
        "Regulates endocrine function, specifically thyroid and metabolic centers"
      ],
      hi: [
        "गर्म वायु फेफड़ों के तापमान को संतुलित रखती है और श्वास नली को स्वच्छ करती है",
        "वेगस तंत्रिका (Vagus Nerve) को सक्रिय करके हृदय गति और मांसपेशी तनाव को कम करता है",
        "सचेत ऊर्जा का संचार करके शरीर के तापमान को संतुलित रूप से बढ़ाता है",
        "थायरॉयड ग्रंथि और अंतःस्रावी प्रणाली के कार्य को सुचारु बनाता है"
      ],
      mr: [
        "फुफ्फुसात जाणारी हवा उबदार होते, ज्यामुळे प्रतिकारशक्ती वाढते",
        "वेगस मज्जातंतू उत्तेजित करून शारीरिक व मानसिक जडत्व दूर करतो",
        "शरीरात नैसर्गिक उष्णता निर्माण करून सर्व अवयवांना उत्तेजित करतो",
        "थायरॉईड आणि चयापचय संस्था सुरळीत ठेवण्यास अत्यंत महत्त्वाचा ठरतो"
      ],
      gu: [
        "શ્વાસની હવાને હૂંફાળી કરીને ફેફસાં સુધી પહોંચાડે છે જેથી શ્વાસનળી સુરક્ષિત રહે",
        "વેગસ ચેતાને ઉત્તેજિત કરી શારીરિક અક્કડતા અને બ્લડપ્રેશર ઘટાડે છે",
        "શરીરની આંતરિક ગરમી બરાબર જાળવી ચયાપચય ક્રિયાઓ સક્ષમ કરે છે",
        "થાઇરોઇડ ગ્રંથિ અને અંતઃસ્ત્રાવી તંત્રને સંતુલિત કરે છે"
      ]
    },
    precautions: {
      en: [
        "Do not over-tighten your throat; the whisper should be smooth and audible only to you.",
        "Hold the breath only to comfort level—avoid swallowing or straining.",
        "Discontinue if you feel warm throat soreness or constriction discomfort."
      ],
      hi: [
        "गले पर अत्यधिक खिंचाव न दें; फुसफुसाहट इतनी धीमी हो कि केवल आपको सुनाई दे।",
        "सांस अपनी क्षमता अनुसार ही रोकें—अनावश्यक दबाव से बचें।",
        "यदि गले में खराश या दर्द महसूस हो, तो इसका अभ्यास तुरंत रोक दें और सामान्य सांस लें।"
      ],
      mr: [
        "घशावर खूप ताण देऊ नका, समुद्राचा आवाज सुसह्य व मंद असावा.",
        "श्वास स्वतःच्या ताकदीनुसारच सुखकारक रोखून ठेवावा.",
        "घशात जळजळ किंवा दुखू लागल्यास सराव थांबवावा."
      ],
      gu: [
        "ગળાને વધુ પડતું ખેંચવું નહીં; અવાજ એટલો જ હોવો જોઈએ જે માત્ર તમને સંભળાય.",
        "શક્તિ અનુસાર શ્વાસ રોકો—કંઈપણ અકુદરતી ન થવું જોઈએ.",
        "ગળામાં દુખાવો કે બળતરા થાય તો સરાવ તાત્કાલિક રોકી દેવો."
      ]
    },
    instructions: {
      en: [
        "Set up a balanced posture, closing your jaw softly and relaxing your forehead.",
        "Partially close your glottis (the back of your throat) as if preparing to fog a cold mirror.",
        "Inhale slowly through both nostrils, creating a soft, warm ocean-wave whisper (4 seconds).",
        "Retain the warm breath inside, feeling the heat pool in the throat center (4 seconds).",
        "Exhale slowly with the same throat constriction, creating a steady, soothing hiss (4 seconds).",
        "Practicing 10 rounds creates a robust bioenergetics seal. Feel your heartbeat slowing down."
      ],
      hi: [
        "जबड़े को पूरी तरह ढीला और चेहरे को शांत रखकर आरामदायक मुद्रा में बैठें।",
        "गले के पिछले हिस्से (Glottis) को थोड़ा सिकोड़ें, जैसे कांच पर भाप छोड़ते समय करते हैं।",
        "नासिका मार्ग से सांस लें, जिससे गले की रगड़ से एक धीमी समुद्री हवा जैसी आवाज उत्पन्न हो (४ सेकंड)।",
        "सांस को ४ सेकंड के लिए रोकें, गले के केंद्र में उठती हुई ऊर्जा का अनुभव करें।",
        "उसी प्रकार गले को संकुचित रखकर धीरे-धीरे सांस छोड़ें, जिससे मंद सुरीली 'हँस...' जैसी ध्वनि निकले।",
        "१० चक्रों का अभ्यास मानसिक विचारों को शांत करता है। अपनी शांत धड़कन महसूस करें।"
      ],
      mr: [
        "डोळे बंद करून अत्यंत शांतपणे आणि सहज बसावे.",
        "घशाच्या पाठीमागील स्वरयंत्र सिकोडून घ्या, जसे आपण काचेवर वाफ सोडताना करतो.",
        "नाकावाटे श्वास घेताना घशातून समुद्राच्या लाटां सारखा नाद निर्माण करा (४ सेकंद).",
        "उबदार श्वास ४ सेकंद आत रोखून ठेवा, घशाभोवती निर्माण होणाऱ्या चैतन्याकडे लक्ष द्या.",
        "घसा सिकोडलेला ठेवून नाकावाटे श्वास हळूवार ४ सेकंद बाहेर सोडा.",
        "हा सराव १० वेळा केल्यास मानसिक ताण संपूर्ण नष्ट होतो."
      ],
      gu: [
        "તમારા જડબાને ખૂબ હળવા અને આંખો તેમજ ચહેરાને શાંત રાખી બેસો.",
        "ગળાના પાછળના ભાગને (કંઠદ્વાર) તે રીતે સંકોચો જે રીતે અરીસા પર વરાળ છોડવા કરીએ છીએ.",
        "નસકોરા દ્વારા ધીમેથી શ્વાસ લો, ગળાના ઘર્ષણથી ૪ સેકન્ડ સુધી સમુદ્રી અવાજ ચાલુ રહો.",
        "૪ સેકન્ડ તેને અંદર સમાવી રાખો, ગળાના આધારે ઉષ્માનો અનુભવ કરો.",
        "તે જ રીતે ગળાને સંકોચીને ૪ સેકન્ડ સુધી શ્વાસ ધીમેથી બહાર કાઢો.",
        "આ પ્રાણાયામ ૧૦ વખત કરવાથી માનસિક ઉદ્વેગ શાંત થાય છે અને ધબકારા હળવા થાય છે."
      ]
    },
    ratio: { inhale: 4, hold: 4, exhale: 4, empty: 0 },
    style: "from-teal-500/10 to-emerald-500/15 text-teal-700 dark:text-emerald-400"
  }
];

export default function BreathingSection({ t, currentLang = "en" }: BreathingSectionProps) {
  const [selectedTech, setSelectedTech] = useState<PranayamaTechnique>(PRANAYAMA_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale" | "empty">("inhale");
  const [countdown, setCountdown] = useState<number>(selectedTech.ratio.inhale);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [infoTab, setInfoTab] = useState<"instructions" | "benefits" | "precautions">("instructions");

  // Recharts Analytics State
  const [weeklyData, setWeeklyData] = useState<WeeklyStatItem[]>([
    { day: "Mon", minutes: 3.5, sessions: 1 },
    { day: "Tue", minutes: 5.0, sessions: 2 },
    { day: "Wed", minutes: 2.0, sessions: 1 },
    { day: "Thu", minutes: 6.5, sessions: 3 },
    { day: "Fri", minutes: 4.0, sessions: 2 },
    { day: "Sat", minutes: 8.5, sessions: 5 },
    { day: "Sun", minutes: 0.0, sessions: 0 },
  ]);

  const getTodayDayName = () => {
    const d = new Date();
    const dayIndex = d.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names[dayIndex];
  };

  const handleCycleComplete = () => {
    setCyclesCompleted((c) => {
      const nextCount = c + 1;
      setWeeklyData((prev) => {
        const todayName = getTodayDayName();
        return prev.map((item) => {
          if (item.day === todayName) {
            return { ...item, sessions: item.sessions + 1 };
          }
          return item;
        });
      });
      return nextCount;
    });
  };

  const simulatePractice = (m: number) => {
    setWeeklyData((prev) => {
      const todayName = getTodayDayName();
      return prev.map((item) => {
        if (item.day === todayName) {
          const nextMins = parseFloat((item.minutes + m).toFixed(2));
          return {
            ...item,
            minutes: nextMins,
            sessions: item.sessions + 1
          };
        }
        return item;
      });
    });
  };

  const resetSimulatorData = () => {
    setWeeklyData([
      { day: "Mon", minutes: 3.5, sessions: 1 },
      { day: "Tue", minutes: 5.0, sessions: 2 },
      { day: "Wed", minutes: 2.0, sessions: 1 },
      { day: "Thu", minutes: 6.5, sessions: 3 },
      { day: "Fri", minutes: 4.0, sessions: 2 },
      { day: "Sat", minutes: 8.5, sessions: 5 },
      { day: "Sun", minutes: 0.0, sessions: 0 },
    ]);
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Synchronize dynamic info when selected technique changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentPhase("inhale");
    setCountdown(selectedTech.ratio.inhale);
    setCyclesCompleted(0);
    stopSynth();
  }, [selectedTech]);

  // Clean timer & sound on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopSynth();
    };
  }, []);

  // Visual text mappings based on active language
  const LOCALIZED_BREATH_STRINGS: Record<string, any> = {
    en: {
      sectionTitle: "Pranayama & Breathing Sanctuary",
      sectionSub: "Harness the power of yogic life force (Prana). Regulate your parasympathetic nervous system, increase cellular oxygenation, and find profound stillness within minutes.",
      selectTechnique: "Select Practice Mode",
      startPractice: "Begin Session",
      pausePractice: "Pause Guide",
      resetPractice: "Reset Sanctuary",
      inhaleState: "Inhale (Puraka)",
      holdState: "Retain Inside (Kumbhaka)",
      exhaleState: "Exhale Warmly (Rechaka)",
      emptyState: "Hold Void (Sunyaka)",
      inhaleIntro: "Draw pure breath into your chest and solar plexus.",
      holdIntro: "Absorb the life force. Rest in total stillness.",
      exhaleIntro: "Let go of all stress, stiffness, and mental noise.",
      emptyIntro: "Rest within the empty, conscious silent void.",
      soundToggle: "Soli-Wave Hum",
      breathRatio: "Rhythmic Ratio",
      cyclesLabel: "Cycles Completed",
      secLabel: "s",
      backToTop: "Return",
      statsTitle: "Your Sadhana Consistency",
      statsSub: "Monitor your daily mindfulness sessions and breathing practice streaks.",
      weeklyTotal: "Weekly Practice",
      dailyAvg: "Daily Average",
      streakLabel: "Mindful Streak",
      minsLabel: "mins",
      logSessionLabel: "Simulate Breathing Practice",
      completedSessions: "Sessions",
      weeklyConsistency: "Weekly Consistency"
    },
    hi: {
      sectionTitle: "प्राणायाम और श्वास साधना",
      sectionSub: "योगिक प्राण ऊर्जा को जाग्रत करें। अपने तंत्रिका तंत्र को संतुलित करें, कोशिकीय ऑक्सीजन बढ़ाएं और कुछ ही मिनटों में परम मानसिक शांति का अनुभव करें।",
      selectTechnique: "प्राणायाम साधना चुनें",
      startPractice: "साधना प्रारंभ करें",
      pausePractice: "शांत अवस्था रोकें",
      resetPractice: "पुनः प्रारंभ करें",
      inhaleState: "सांस लें (पूरक)",
      holdState: "सांस भीतर रोकें (कुंभक)",
      exhaleState: "सांस छोड़ें (रेचक)",
      emptyState: "शून्य अवस्था (शून्यक)",
      inhaleIntro: "पवित्र श्वास को छाती और पेट में समाहित करें।",
      holdIntro: "प्राण ऊर्जा को महसूस करें, पूर्ण स्थिरता में विश्राम करें।",
      exhaleIntro: "सभी प्रकार के तनाव, संताप और चिंताओं को बाहर निकाल दें।",
      emptyIntro: "खाली और जागृत चेतना की शांत शून्यता में विश्राम करें।",
      soundToggle: "ध्वनि मार्गदर्शन",
      breathRatio: "श्वास नियंत्रण अनुपात",
      cyclesLabel: "पूर्ण किए गए चक्र",
      secLabel: "सेकंड",
      backToTop: "वापस",
      statsTitle: "आपकी साधना निरंतरता",
      statsSub: "अपने दैनिक ध्यान समय और श्वसन अभ्यास चक्रों को ट्रैक करें।",
      weeklyTotal: "साप्ताहिक अभ्यास",
      dailyAvg: "दैनिक औसत",
      streakLabel: "साधना निरंतरता",
      minsLabel: "मिनट",
      logSessionLabel: "त्वरित अभ्यास समय जोड़ें",
      completedSessions: "सत्र",
      weeklyConsistency: "साप्ताहिक निरंतरता"
    },
    mr: {
      sectionTitle: "प्राणायाम आणि श्वसन साधना",
      sectionSub: "योगिक प्राण ऊर्जा जाग्रत करा. मज्जासंस्था संतुलित करा, पेशींची ऑक्सिजन पातळी वाढवा आणि काही मिनिटांतच मनात गाढ शांततेचा अनुभव घ्या.",
      selectTechnique: "प्राणायाम प्रकार निवडा",
      startPractice: "सराव सुरू करा",
      pausePractice: "सराव थांबवा",
      resetPractice: "पुन्हा सुरू करा",
      inhaleState: "श्वास घ्या (पूरक)",
      holdState: "श्वास आत रोखा (कुंभक)",
      exhaleState: "श्वास सोडा (रेचक)",
      emptyState: "शांत शून्य अवस्था (शून्यक)",
      inhaleIntro: "संतत श्वास छाती आणि ओटीपोटात भरून घ्या.",
      holdIntro: "प्राणाचा अनुभव घ्या, पूर्णपणे शांत स्थिर राहा.",
      exhaleIntro: "मनातील सर्व काळजी, जडपणा श्वासासोबत वाहू द्या.",
      emptyIntro: "रिकाम्या शांत चेतनेमध्ये विसावा घ्या.",
      soundToggle: "ध्वनी मार्गदर्शक",
      breathRatio: "श्वसन काल गुणोत्तर",
      cyclesLabel: "पूर्ण चक्र",
      secLabel: "सेकंद",
      backToTop: "मागे",
      statsTitle: "तुमची साधना सातत्य",
      statsSub: "तुमचा दैनंदिन ध्यान सराव आणि श्वसन साखळी तपासा.",
      weeklyTotal: "साप्ताहिक सराव",
      dailyAvg: "दैनंदिन सरासरी",
      streakLabel: "साधना चक्र सातत्य",
      minsLabel: "मिनिटे",
      logSessionLabel: "त्वरित ३ मिनिटे नोंदवा",
      completedSessions: "सत्र",
      weeklyConsistency: "साप्ताहिक सुसंगतता"
    },
    gu: {
      sectionTitle: "પ્રાણાયામ અને શ્વાસ સાધના",
      sectionSub: "યોગિક પ્રાણ શક્તિને જાગ્રત કરો. ચેતાતંત્રને સંતુલિત કરો, કોષોમાં ઓક્સિજન ઉત્તેજિત કરો અને માત્ર થોડી મિનિટોમાં અદ્ભુત આંતરિક શાંતિ મેળવો.",
      selectTechnique: "પ્રાણાયામ સાધના પસંદ કરો",
      startPractice: "સાધના શરૂ કરો",
      pausePractice: "સ્થિર કરો",
      resetPractice: "પુનઃ પ્રારંભ",
      inhaleState: "શ્વાસ લો (પૂરક)",
      holdState: "શ્વાસ અંદર રોકો (કુંભક)",
      exhaleState: "શ્વાસ છોડો (રેચક)",
      emptyState: "શૂન્ય અવસ્થા (શૂન્યક)",
      inhaleIntro: "પવિત્ર શ્વાસને છાતી અને નાભિ સુધી ભરો.",
      holdIntro: "પ્રાણ ઊર્જા અનુભવો, શાંત સ્થિરતામાં વિશ્રામ લો.",
      exhaleIntro: "બધો તાણ, પીડા અને ચિંતાઓને બહાર વહાવી દો.",
      emptyIntro: "ખાલી અને જાગૃત શૂન્યતાની શાંતિમાં લીન બનો.",
      soundToggle: "દૈવી ધ્વનિ",
      breathRatio: "શ્વાસ નિયંત્રણ ગુણોત્તર",
      cyclesLabel: "પૂર્ણ કરેલા ચક્રો",
      secLabel: "સેકન્ડ",
      backToTop: "પાછા",
      statsTitle: "તમારી સાધના સાતત્ય",
      statsSub: "તમારા દૈનિક શ્વાસ સાધના સમય અને સાતત્ય ચક્રને મોનિટર કરો.",
      weeklyTotal: "સાપ્તાહિક અભ્યાસ",
      dailyAvg: "દૈનિક સરેરાશ",
      streakLabel: "નિરંતર સાધના",
      minsLabel: "મિનિટ",
      logSessionLabel: "ઝડપી શ્વાસ સમય ઉમેરો",
      completedSessions: "સત્રો",
      weeklyConsistency: "સાપ્તાહિક સંતોષ આલેખ"
    }
  };

  const loc = LOCALIZED_BREATH_STRINGS[currentLang as "en" | "hi" | "mr" | "gu"] || LOCALIZED_BREATH_STRINGS.en;

  // Web Audio Synth setup for premium biofeedback hum
  const startSynth = () => {
    if (typeof window === "undefined") return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Create primary gentle oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      // Adjust pitch based on phase
      let freq = 136.1; // OM Jahner pitch (Aum resonance)
      if (currentPhase === "inhale") freq = 136.1; // Lower soothing
      if (currentPhase === "hold") freq = 172.06; // Calm retention
      if (currentPhase === "exhale") freq = 126.22; // Relaxed release
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3); // Soft ramp-in

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn("AudioContext initialization bypassed:", e);
    }
  };

  const updateSynthPitch = (phase: "inhale" | "hold" | "exhale" | "empty") => {
    const ctx = audioContextRef.current;
    const osc = oscillatorRef.current;
    const gain = gainNodeRef.current;
    if (!ctx || !osc || !gain || !soundEnabled) return;

    let targetFreq = 136.10; // Om frequency
    let targetVol = 0.12;

    switch (phase) {
      case "inhale":
        targetFreq = 150.0; // gradual soothing swell
        targetVol = 0.15;
        // Frequency sweep
        osc.frequency.exponentialRampToValueAtTime(200.0, ctx.currentTime + selectedTech.ratio.inhale);
        break;
      case "hold":
        targetFreq = 172.0; 
        targetVol = 0.08; // Quiet hum during focus retention
        osc.frequency.exponentialRampToValueAtTime(172.0, ctx.currentTime + 0.5);
        break;
      case "exhale":
        targetFreq = 120.0;
        targetVol = 0.16; // Deeper release
        osc.frequency.exponentialRampToValueAtTime(110.0, ctx.currentTime + selectedTech.ratio.exhale);
        break;
      case "empty":
        targetFreq = 100.0;
        targetVol = 0.01; // Silent void
        osc.frequency.setValueAtTime(100.0, ctx.currentTime);
        break;
    }

    gain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.3);
  };

  const stopSynth = () => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.0, audioContextRef.current.currentTime + 0.2);
      }
      setTimeout(() => {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
          oscillatorRef.current = null;
        }
        if (gainNodeRef.current) {
          gainNodeRef.current.disconnect();
          gainNodeRef.current = null;
        }
      }, 250);
    } catch {
      // safe fallback
    }
  };

  // Toggle audio guide
  const handleSoundToggle = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      if (isPlaying) {
        setTimeout(() => {
          startSynth();
          updateSynthPitch(currentPhase);
        }, 50);
      }
    } else {
      setSoundEnabled(false);
      stopSynth();
    }
  };

  // State machine loop for breathing cycles
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      stopSynth();
      return;
    }

    // Trigger or update sound
    if (soundEnabled) {
      if (!oscillatorRef.current) {
        startSynth();
      }
      updateSynthPitch(currentPhase);
    } else {
      stopSynth();
    }

    timerRef.current = setInterval(() => {
      // Live accumulate practice seconds count in the Recharts weekly metrics
      setWeeklyData((prev) => {
        const todayName = getTodayDayName();
        return prev.map((item) => {
          if (item.day === todayName) {
            return {
              ...item,
              // Adding 1 second to today's minutes tally
              minutes: parseFloat((item.minutes + 1 / 60).toFixed(4)),
            };
          }
          return item;
        });
      });

      setCountdown((prev) => {
        if (prev <= 1) {
          // Transition to the next phase in the standard breathing box loop
          let nextPhase: "inhale" | "hold" | "exhale" | "empty" = "inhale";
          let nextSeconds = 4;

          if (currentPhase === "inhale") {
            if (selectedTech.ratio.hold > 0) {
              nextPhase = "hold";
              nextSeconds = selectedTech.ratio.hold;
            } else {
              nextPhase = "exhale";
              nextSeconds = selectedTech.ratio.exhale;
            }
          } else if (currentPhase === "hold") {
            nextPhase = "exhale";
            nextSeconds = selectedTech.ratio.exhale;
          } else if (currentPhase === "exhale") {
            if (selectedTech.ratio.empty > 0) {
              nextPhase = "empty";
              nextSeconds = selectedTech.ratio.empty;
            } else {
              nextPhase = "inhale";
              nextSeconds = selectedTech.ratio.inhale;
              handleCycleComplete();
            }
          } else if (currentPhase === "empty") {
            nextPhase = "inhale";
            nextSeconds = selectedTech.ratio.inhale;
            handleCycleComplete();
          }

          setCurrentPhase(nextPhase);
          return nextSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentPhase, selectedTech, soundEnabled]);

  // Determine current display instruction text
  let activeInstruction = loc.inhaleIntro;
  if (currentPhase === "hold") activeInstruction = loc.holdIntro;
  if (currentPhase === "exhale") activeInstruction = loc.exhaleIntro;
  if (currentPhase === "empty") activeInstruction = loc.emptyIntro;

  // Determine scale of circle dynamically based on state to ensure smooth pacing
  const getCircleScale = () => {
    if (!isPlaying) return 1.0;
    
    const ratioMap = selectedTech.ratio;
    switch (currentPhase) {
      case "inhale":
        // Compute progress fraction
        const inhalePass = ratioMap.inhale - countdown;
        const inhalePercent = inhalePass / ratioMap.inhale;
        return 1.0 + (0.7 * inhalePercent); // expands smoothly from 1.0 to 1.7
      case "hold":
        return 1.7; // holds broad
      case "exhale":
        const exhalePass = ratioMap.exhale - countdown;
        const exhalePercent = exhalePass / ratioMap.exhale;
        return 1.7 - (0.7 * exhalePercent); // contracts smoothly back to 1.0
      case "empty":
        return 0.95; // slightly contracted below resting for visceral empty feeling
      default:
        return 1.0;
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "inhale": return "bg-saffron-500 text-white shadow-saffron-300 dark:shadow-saffron-950";
      case "hold": return "bg-amber-500 text-white shadow-amber-300 dark:shadow-amber-950";
      case "exhale": return "bg-emerald-500 text-white shadow-emerald-200 dark:shadow-emerald-950";
      case "empty": return "bg-slate-500 text-white shadow-slate-200 dark:shadow-slate-900";
    }
  };

  const getPhaseTextColor = () => {
    switch (currentPhase) {
      case "inhale": return "text-orange-600 dark:text-orange-400";
      case "hold": return "text-amber-500 dark:text-amber-400";
      case "exhale": return "text-emerald-600 dark:text-emerald-400";
      case "empty": return "text-slate-500 dark:text-slate-400";
    }
  };

  // Reset function
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhase("inhale");
    setCountdown(selectedTech.ratio.inhale);
    setCyclesCompleted(0);
    stopSynth();
  };

  const currentLangCode = ["en", "hi", "mr", "gu"].includes(currentLang) ? currentLang : "en";
  const namesObj = selectedTech.names[currentLangCode] || selectedTech.names.en;

  const activeRatioString = `${selectedTech.ratio.inhale} : ${selectedTech.ratio.hold} : ${selectedTech.ratio.exhale} : ${selectedTech.ratio.empty}`;

  return (
    <section id="breathing-sanctuary-section" className="py-20 bg-gradient-to-b from-[#FFF5EC] to-[#FFFAF5] dark:from-slate-950 dark:to-slate-900 border-y border-orange-100/50 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-50 dark:bg-slate-900 text-saffron-600 dark:text-orange-400 text-xs font-semibold tracking-wider uppercase mb-4 border border-saffron-100 dark:border-orange-950/40">
            <Wind className="w-4.5 h-4.5 animate-pulse" />
            <span>Sadhana Sanctuary</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {loc.sectionTitle}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed">
            {loc.sectionSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* LEFT: Quick Tabs of Techniques */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#FF7A00] dark:text-orange-400 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {loc.selectTechnique}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {PRANAYAMA_DATA.map((tech) => {
                  const isActive = tech.id === selectedTech.id;
                  const localizedName = tech.names[currentLangCode] || tech.names.en;
                  return (
                    <button
                      key={tech.id}
                      id={`tech-btn-${tech.id}`}
                      onClick={() => setSelectedTech(tech)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border flex flex-col justify-between relative overflow-hidden group ${
                        isActive
                          ? "bg-white dark:bg-slate-900 border-[#FF7A00] shadow-md shadow-orange-100/40 dark:shadow-none"
                          : "bg-white/50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900 border-orange-100/30 dark:border-slate-800 hover:border-orange-200"
                      }`}
                    >
                      {/* Brand saffron accent bar */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF7A00]" />
                      )}
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#FF7A00] transition-colors">
                            {localizedName.main}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-neutral-400 font-sans mt-0.5 block">
                            {localizedName.alt}
                          </span>
                        </div>
                        <div className={`p-1.5 rounded-lg ${isActive ? "bg-saffron-500/10 text-[#FF7A00]" : "text-slate-400"}`}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 border-t border-slate-100 dark:border-slate-800/60 pt-2">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {tech.ratio.inhale}:{tech.ratio.hold}:{tech.ratio.exhale}:{tech.ratio.empty}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-saffron-50 dark:bg-slate-800 text-saffron-700 dark:text-orange-300 font-medium">
                          {tech.ratio.inhale + tech.ratio.hold + tech.ratio.exhale + tech.ratio.empty}s Cycle
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evidence & References box inside list */}
            <div className="p-5 rounded-2xl bg-[#FFF9F3] dark:bg-slate-900/40 border border-orange-100/40 dark:border-slate-800/80 mt-6 lg:mt-0">
              <div className="flex gap-2.5 items-start">
                <Sparkles className="w-5 h-5 text-saffron-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white font-serif">Scientific Calibration</h5>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                    This auditory sanctuary uses custom sinusoidal hum technology based on ancient Himalayan sounding bowls calibrated to 136.1 Hz (OM pitch) to support neurological coherence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE: Interactive Visual Breathing Coach */}
          <div className="lg:col-span-5 flex flex-col justify-between items-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-orange-100/20 dark:border-slate-800/60 relative overflow-hidden shadow-sm">
            
            {/* Header info inside coach */}
            <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="text-left">
                <span className="text-[10px] font-bold tracking-widest text-[#FF7A00] uppercase block">
                  Active Sanctuary
                </span>
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                  {namesObj.main}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">
                  {loc.breathRatio}
                </span>
                <span className="text-sm font-mono font-semibold text-slate-800 dark:text-neutral-100">
                  {activeRatioString}
                </span>
              </div>
            </div>

            {/* CENTRAL DYNAMIC STAGE: The Breathing Circle */}
            <div className="relative w-72 h-72 my-10 flex items-center justify-center">
              
              {/* Pulsating background aura ring */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0.1, scale: 0.8 }}
                    animate={{
                      opacity: [0.15, 0.3, 0.15],
                      scale: getCircleScale() * 1.15,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-saffron-400/20 to-orange-500/20 blur-xl"
                  />
                )}
              </AnimatePresence>

              {/* Glowing decorative breathing ripples */}
              <div className="absolute inset-0 rounded-full border border-orange-100/40 dark:border-slate-800 pointer-events-none scale-100" />
              <div className="absolute inset-0 rounded-full border border-orange-100/10 dark:border-slate-800/50 pointer-events-none scale-110" />

              {/* Main functional coach circle */}
              <motion.div
                id="breathing-circle-coach"
                animate={{
                  scale: getCircleScale()
                }}
                transition={{
                  duration: 1.0,
                  ease: "linear" // strict linear timeline alignment
                }}
                className={`w-48 h-48 rounded-full flex flex-col items-center justify-center relative shadow-2xl transition-all duration-300 ${getPhaseColor()}`}
              >
                
                {/* Visual ticking ring segment (SVG Overlay) */}
                <svg className="absolute inset-0 -rotate-90 w-full h-full pointer-events-none">
                  <circle
                    cx="96"
                    cy="96"
                    r="90"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="3"
                  />
                  {isPlaying && (
                    <motion.circle
                      key={`${currentPhase}-${countdown}`}
                      cx="96"
                      cy="96"
                      r="90"
                      fill="none"
                      stroke="white"
                      strokeWidth="5"
                      strokeDasharray="565"
                      initial={{ strokeDashoffset: 565 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{
                        duration: 1.0,
                        ease: "linear"
                      }}
                    />
                  )}
                </svg>

                {/* Central Countdown Number */}
                <div className="text-center z-10">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={`${currentPhase}-${countdown}`}
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                      className="text-5xl font-mono font-bold tracking-tight block"
                    >
                      {countdown}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 block mt-1">
                    {loc.secLabel}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Active stage feedback context */}
            <div className="text-center min-h-[50px] px-4 w-full mb-6">
              <span className={`text-lg font-serif font-bold ${getPhaseTextColor()} block`}>
                {isPlaying ? (
                  currentPhase === "inhale" ? loc.inhaleState :
                  currentPhase === "hold" ? loc.holdState :
                  currentPhase === "exhale" ? loc.exhaleState :
                  loc.emptyState
                ) : (
                  "Pranayama Session Idle"
                )}
              </span>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                {isPlaying ? activeInstruction : "Configure audio parameters and press start to harmonize breath."}
              </p>
            </div>

            {/* CONTROLS AREA */}
            <div className="w-full flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-5">
              
              {/* Volume Hum Toggle */}
              <button
                id="toggle-sanctuary-sound"
                onClick={handleSoundToggle}
                className={`p-3 rounded-full transition-all duration-350 border ${
                  soundEnabled
                    ? "bg-amber-500/10 text-[#FF7A00] border-amber-300"
                    : "bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                }`}
                title={loc.soundToggle}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Main Play/Pause */}
              <button
                id="toggle-sanctuary-play"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md shadow-orange-100/50 dark:shadow-none hover:scale-[1.02] active:scale-95 ${
                  isPlaying
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-950 dark:border-white"
                    : "bg-[#FF7A00] border-[#FF7A00] text-white hover:bg-orange-600"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>{loc.pausePractice}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{loc.startPractice}</span>
                  </>
                )}
              </button>

              {/* Reset Control */}
              <button
                id="reset-sanctuary"
                onClick={handleReset}
                className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-full text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-250"
                title={loc.resetPractice}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom mini tracker panel */}
            {cyclesCompleted > 0 && (
              <div className="absolute top-4 left-4 bg-emerald-50 dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100/70 dark:border-slate-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{cyclesCompleted} {loc.cyclesLabel}</span>
              </div>
            )}
          </div>

          {/* RIGHT: Contextual Educational Tabs (Benefits, Safety, Instructions) */}
          <div className="lg:col-span-3 flex flex-col justify-start bg-white dark:bg-slate-900 border border-orange-100/20 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
            
            {/* Info tab toggles */}
            <div className="flex border-b border-slate-100 dark:border-slate-800/80 pb-3 gap-2">
              <button
                onClick={() => setInfoTab("instructions")}
                className={`flex-1 pb-1 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
                  infoTab === "instructions"
                    ? "border-[#FF7A00] text-[#FF7A00]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Guide
              </button>
              <button
                onClick={() => setInfoTab("benefits")}
                className={`flex-1 pb-1 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
                  infoTab === "benefits"
                    ? "border-[#FF7A00] text-[#FF7A00]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Benefits
              </button>
              <button
                onClick={() => setInfoTab("precautions")}
                className={`flex-1 pb-1 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
                  infoTab === "precautions"
                    ? "border-b-amber-500 text-amber-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Safety
              </button>
            </div>

            {/* Tab content panel */}
            <div className="mt-5 flex-1 flex flex-col justify-between overflow-y-auto max-h-[360px] pr-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={infoTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* TAB 1: Step by Step Instructions */}
                  {infoTab === "instructions" && (
                    <div className="space-y-4">
                      {selectedTech.instructions[currentLangCode]?.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                          <span className="w-5 h-5 shrink-0 rounded-full bg-saffron-50 dark:bg-slate-800 text-saffron-600 dark:text-orange-300 font-mono font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <p>{step}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 2: Clinical Benefits */}
                  {infoTab === "benefits" && (
                    <div className="space-y-3">
                      {selectedTech.benefits[currentLangCode]?.map((benefit, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <p>{benefit}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: Contraindications and Precautions */}
                  {infoTab === "precautions" && (
                    <div className="space-y-3">
                      {selectedTech.precautions[currentLangCode]?.map((precaution, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start text-xs text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-100/50 dark:border-amber-950/50 leading-relaxed">
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <p>{precaution}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>

        </div>

        {/* Sadhana Statistics & Consistency Chart */}
        {(() => {
          const weeklyTotalMinutes = weeklyData.reduce((acc, curr) => acc + curr.minutes, 0);
          const dailyAverage = weeklyTotalMinutes / 7;
          const consistencyStreak = weeklyData.filter((d) => d.minutes > 0.05).length;

          return (
            <div className="mt-16 bg-white dark:bg-slate-900 border border-orange-100/30 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800/60 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF7A00] dark:text-orange-400 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{loc.weeklyConsistency || "Weekly Consistency"}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                    {loc.statsTitle || "Your Sadhana Consistency"}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
                    {loc.statsSub || "Monitor your daily mindfulness sessions and breathing practice streaks."}
                  </p>
                </div>

                {/* Simulated Live Action Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    id="log-practice-simulation-1"
                    onClick={() => simulatePractice(1)}
                    className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/40 text-[#FF7A00] dark:text-orange-300 text-xs font-semibold border border-orange-100/50 dark:border-orange-900/30 transition-all duration-300 hover:scale-[1.02]"
                  >
                    +1 {loc.minsLabel || "mins"}
                  </button>
                  <button
                    id="log-practice-simulation-5"
                    onClick={() => simulatePractice(5)}
                    className="px-4 py-2 rounded-xl bg-[#FF7A00] hover:bg-orange-600 text-white text-xs font-semibold shadow-sm transition-all duration-300 hover:scale-[1.02]"
                  >
                    +5 {loc.minsLabel || "mins"}
                  </button>
                  <button
                    id="reset-practice-simulation"
                    onClick={resetSimulatorData}
                    className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-neutral-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all"
                  >
                    Reset Stats
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Recharts Bar Display */}
                <div className="lg:col-span-8 w-full">
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="saffronGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF7A00" stopOpacity={0.85} />
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.25} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.3)" />
                        <XAxis
                          dataKey="day"
                          tick={{ fill: "#64748B", fontSize: 11, fontWeight: 505 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#64748B", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          unit="m"
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 122, 0, 0.04)" }} />
                        <Bar dataKey="minutes" radius={[6, 6, 0, 0]} barSize={32}>
                          {weeklyData.map((entry, index) => {
                            const isToday = entry.day === getTodayDayName();
                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={isToday ? "url(#saffronGradient)" : "#FF7900"}
                                fillOpacity={isToday ? 1.0 : 0.45}
                                stroke={isToday ? "#FF7A00" : "transparent"}
                                strokeWidth={1.5}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Analytics Overview Cards */}
                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  
                  {/* Card 1: Practice Volume */}
                  <div className="p-5 rounded-2xl bg-orange-50/30 dark:bg-slate-900/40 border border-orange-100/20 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-neutral-400 font-sans block">
                        {loc.weeklyTotal || "Weekly Practice"}
                      </span>
                      <span className="text-2xl font-serif font-black text-slate-900 dark:text-white mt-1 block">
                        {weeklyTotalMinutes.toFixed(1)} <span className="text-sm font-sans font-medium text-slate-500">{loc.minsLabel || "mins"}</span>
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 text-[#FF7A00] flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card 2: Daily Average */}
                  <div className="p-5 rounded-2xl bg-orange-50/30 dark:bg-slate-900/40 border border-orange-100/20 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-neutral-400 font-sans block">
                        {loc.dailyAvg || "Daily Average"}
                      </span>
                      <span className="text-2xl font-serif font-black text-slate-900 dark:text-white mt-1 block">
                        {dailyAverage.toFixed(1)} <span className="text-sm font-sans font-medium text-slate-500">{loc.minsLabel || "mins"}</span>
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Wind className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card 3: Consistency Streak */}
                  <div className="p-5 rounded-2xl bg-orange-50/30 dark:bg-slate-900/40 border border-orange-100/20 dark:border-[#1e293b] flex items-center justify-between sm:col-span-2 lg:col-span-1">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-neutral-400 font-sans block">
                        {loc.streakLabel || "Mindful Streak"}
                      </span>
                      <span className="text-2xl font-serif font-black text-[#1e293b] dark:text-white mt-1 block">
                        {consistencyStreak} <span className="text-sm font-sans font-medium text-slate-500">Days</span>
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
}
