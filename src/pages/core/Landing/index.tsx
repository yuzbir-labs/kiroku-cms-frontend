import {
  ArrowRightOutlined,
  BankOutlined,
  BarChartOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckOutlined,
  CrownOutlined,
  IdcardOutlined,
  MessageOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const elements = document.querySelectorAll(`.${styles.animateOnScroll}`);
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          element.classList.add(styles.visible);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Removed statistics section as requested

  const features = [
    {
      icon: <BankOutlined style={{ color: '#ffffff' }} />,
      title: 'Filiallarınızı Asanlıqla İdarə Edin',
      description:
        'Kiroku sizə bir neçə fiziki və ya onlayn tədris məkanını vahid platformadan idarə etməyə imkan verir.',
      list: [
        'Filial məlumatlarının idarəsi',
        'Kurslar və qrupların təşkili',
        'Təlimçilərin və tələbələrin koordinasiyası',
        'Tədris cədvəllərinin planlaşdırılması',
        'Vahid mərkəzdən monitorinq',
      ],
    },
    {
      icon: <BookOutlined style={{ color: '#ffffff' }} />,
      title: 'Kursların Peşəkar İdarə Olunması',
      description:
        'Kiroku kurs rəhbərlərinə bütün tədris proseslərini eyni yerdən izləmək imkanı yaradır:',
      list: [
        'Kurs açılması və qruplaşdırılması',
        'Səviyyə və statusların idarəsi',
        'Təlimçilərin kurslara təyin olunması',
        'Tələbələrin qeydiyyata alınması',
        'Qrup içi və fərdi məlumatların idarə edilməsi',
        'Kurs materiallarının paylaşılması',
      ],
    },
    {
      icon: <CalendarOutlined style={{ color: '#ffffff' }} />,
      title: 'Davamlılıq və Jurnal İdarəçiliyi',
      description: 'Artıq davamiyyət cədvəllərini kağızla və ya Excel-də aparmağa ehtiyac yoxdur.',
      list: [
        'Dərsə gələn və gəlməyən tələbələrin asan işarələnməsi',
        'Davamiyyət tarixçəsinin hər an izlənməsi',
        'Müəllim və rəhbərlərin uyğun icazə səviyyələri',
        'Tələbələrin aktivlik dinamikasının analizi',
        'Avtomatik davamiyyət hesabatları',
      ],
    },
    {
      icon: <TeamOutlined style={{ color: '#ffffff' }} />,
      title: 'Komanda İdarəçiliyi və Roller',
      description:
        'Kiroku çox səviyyəli idarəetmə mexanizminə malikdir. Burada hər kəs öz roluna uyğun imkanlara sahib olur:',
      list: [
        'Təşkilat Admini - Tam nəzarət',
        'Filial Admini - Filial idarəçiliyi',
        'Filial Meneceri - Əməliyyat idarəsi',
        'Müəllim - Dərs və tələbə idarəsi',
        'Tələbə - Şəxsi profil və materiallar',
        'Valideyn - Uşaq məlumatlarının izlənməsi',
      ],
    },
    {
      icon: <MessageOutlined style={{ color: '#ffffff' }} />,
      title: 'Sorğular və Müraciətlər',
      description:
        'Potensial tələbələrdən gələn sorğuları sistemli şəkildə idarə edin və onları kurs qeydiyyatına çevirin.',
      list: [
        'Müraciətlərin qeydiyyatı',
        'Status izləmə və yenilənməsi',
        'Tələbə məlumatlarının saxlanması',
        'Sorğudan qeydiyyata avtomatik keçid',
        'Təşkilatın inkişaf dinamikasının analizi',
      ],
    },
    {
      icon: <BarChartOutlined style={{ color: '#ffffff' }} />,
      title: 'Hesabatlar və Analitika',
      description: 'Təşkilatınızın fəaliyyətini detallı statistika və hesabatlarla izləyin.',
      list: [
        'Filiallar üzrə ümumi statistika',
        'Tələbə və müəllim saylarının monitorinqi',
        'Kurs və qrup məlumatları',
        'Davamiyyət hesabatları',
        'İdarəetmə qərarları üçün analitik məlumatlar',
      ],
    },
  ];

  const roles = [
    {
      title: 'Təşkilat Admini',
      icon: <CrownOutlined style={{ color: '#667eea' }} />,
      description: 'Bütün sistem üzərində tam nəzarət və idarəetmə',
      features: ['Filial idarəsi', 'İstifadəçi rolları', 'Ümumi statistika', 'Sistem parametrləri'],
    },
    {
      title: 'Filial Meneceri',
      icon: <IdcardOutlined style={{ color: '#667eea' }} />,
      description: 'Filial səviyyəsində tədris proseslərinin idarəsi',
      features: ['Kurs idarəsi', 'Müəllim təyini', 'Qrup yaradılması', 'Davamiyyət nəzarəti'],
    },
    {
      title: 'Müəllim',
      icon: <UserOutlined style={{ color: '#667eea' }} />,
      description: 'Dərslərin keçirilməsi və tələbə idarəsi',
      features: ['Davamiyyət qeydi', 'Material paylaşımı', 'Tələbə məlumatları', 'Dərs cədvəli'],
    },
    {
      title: 'Tələbə',
      icon: <TeamOutlined style={{ color: '#667eea' }} />,
      description: 'Şəxsi məlumatlar və tədris materiallarına çıxış',
      features: [
        'Profil məlumatları',
        'Kurs materialları',
        'Davamiyyət tarixi',
        'Qiymətləndirmələr',
      ],
    },
  ];

  const benefits = [
    '✅ İstifadəsi çox rahat və intuitivdir',
    '✅ Hər ölçüdə tədris mərkəzinə uyğunlaşır',
    '✅ Davamiyyət, kurslar, materiallar və şəxsi məlumatlar vahid mərkəzdə',
    '✅ Genişlənə bilən və gələcək funksiyalara açıq sistem',
    '✅ Onlayn və hibrid tədris modelini tam dəstəkləyir',
    '✅ Bulud əsaslı və təhlükəsiz infrastruktur',
    '✅ Mobil cihazlarla tam uyğunlaşma',
    '✅ 7/24 texniki dəstək',
  ];

  return (
    <div className={styles.landing}>
      {/* Header */}
      <header className={`${styles.header} ${isVisible ? styles.headerVisible : ''}`}>
        <div className={styles.headerContent}>
          <div className={styles.logo} onClick={() => navigate('/')}>
            <img src="/kiroku-icon.svg" alt="Kiroku" className={styles.logoSvg} />
            <span className={styles.logoText}>iroku</span>
          </div>
          <button className={styles.loginButton} onClick={handleLoginClick}>
            Daxil ol
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.heroContent} ${isVisible ? styles.fadeInUp : ''}`}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeIcon}>
              <StarOutlined style={{ color: '#667eea' }} />
            </span>
            Müasir Tədris Həlli
          </div>
          <h1 className={styles.heroTitle}>
            Tədris və Kurs İdarəetməsini
            <span className={styles.gradientText}> Sadələşdirin</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Kiroku – təhsil müəssisələri, kurs mərkəzləri və təlim platformaları üçün tam funksional
            idarəetmə sistemi. Filiallarınızı, kurslarınızı, müəllimlərinizi və tələbələrinizi vahid
            platformada idarə edin.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.heroCta} onClick={handleLoginClick}>
              İndi Başlayın
              <span className={styles.arrowIcon}>
                <ArrowRightOutlined style={{ color: '#ffffff' }} />
              </span>
            </button>
            <button
              className={styles.heroSecondary}
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ətraflı Məlumat
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section removed as requested */}

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.featuresContent}>
          <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
            <h2 className={styles.sectionTitle}>Əsas Xüsusiyyətlər</h2>
            <p className={styles.sectionSubtitle}>
              Kiroku ilə tədris proseslərinizi tam nəzarət altında saxlayın
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={`${styles.featureCard} ${styles.animateOnScroll}`}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <ul className={styles.featureList}>
                  {feature.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className={styles.roles}>
        <div className={styles.rolesContent}>
          <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
            <h2 className={styles.sectionTitle}>Hər Kəs Üçün Xüsusi İmkanlar</h2>
            <p className={styles.sectionSubtitle}>
              İstifadəçi roluna görə fərqli səlahiyyət və funksiyalar
            </p>
          </div>
          <div className={styles.rolesGrid}>
            {roles.map((role, index) => (
              <div key={index} className={`${styles.roleCard} ${styles.animateOnScroll}`}>
                <div className={styles.roleIcon}>{role.icon}</div>
                <h3 className={styles.roleTitle}>{role.title}</h3>
                <p className={styles.roleDescription}>{role.description}</p>
                <ul className={styles.roleFeatures}>
                  {role.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.benefitsContent}>
          <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
            <h2 className={styles.sectionTitle}>Niyə Kiroku?</h2>
            <p className={styles.sectionSubtitle}>Təhsil idarəçiliyində yeni standart</p>
          </div>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={`${styles.benefitItem} ${styles.animateOnScroll}`}>
                <span className={styles.benefitIcon}>
                  <CheckOutlined style={{ color: '#10b981' }} />
                </span>
                <span className={styles.benefitText}>{benefit.replace('✅ ', '')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={`${styles.ctaContent} ${styles.animateOnScroll}`}>
          <h2 className={styles.ctaTitle}>Hazırsınızsa, İndi Başlayın</h2>
          <p className={styles.ctaDescription}>
            Kiroku sizin təhsil müəssisənizin daxili idarəetməsini gücləndirir, təlim keyfiyyətini
            artırır və vaxtınıza qənaət edir. Fokusunuzu sənədləşməyə deyil – həqiqi tədris
            prosesinə yönəldin.
          </p>
          <button className={styles.ctaButton} onClick={handleLoginClick}>
            <span>İndi Başlayın</span>
            <span className={styles.arrowIcon}>
              <ArrowRightOutlined style={{ color: '#667eea' }} />
            </span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBottom}>
            <p>© 2025 Kiroku. Bütün hüquqlar qorunur.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
