import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: '🏢',
      title: 'Filiallarınızı Asanlıqla İdarə Edin',
      description:
        'Kiroku sizə bir neçə fiziki və ya onlayn tədris məkanını vahid platformadan idarə etməyə imkan verir.',
      list: [
        'Kurslar',
        'Təlimçilər',
        'Tələbələr',
        'Qruplar',
        'Tədris cədvəlləri',
      ],
    },
    {
      icon: '📚',
      title: 'Kursların Peşəkar İdarə Olunması',
      description:
        'Kiroku kurs rəhbərlərinə bütün tədris proseslərini eyni yerdən izləmək imkanı yaradır:',
      list: [
        'Kurs açılması və qruplaşdırılması',
        'Təlimçilərin kurslara təyin olunması',
        'Tələbələrin qeydiyyata alınması',
        'Qrup içi və fərdi məlumatların idarə edilməsi',
      ],
    },
    {
      icon: '📋',
      title: 'Davamlılıq və Jurnal İdarəçiliyi',
      description:
        'Artıq davamiyyət cədvəllərini kağızla və ya Excel-də aparmağa ehtiyac yoxdur.',
      list: [
        'Dərsə gələn və gəlməyən tələbələrin asan işarələnməsi',
        'Davamiyyət tarixçəsinin hər an izlənməsi',
        'Müəllim və rəhbərlərin uyğun icazə səriştələri',
        'Tələbələrin aktivlik dinamikasının analiz olunması',
      ],
    },
    {
      icon: '📁',
      title: 'Materiallar və Resurs Paylaşımı',
      description:
        'Təlimçilər dərs vəsaitlərini, slaydları, tapşırıqları, testləri və başqa faylları sistem üzərindən tələbələrlə asanlıqla bölüşə bilərlər.',
      list: [
        'Paylaşılan materialları yükləyə',
        'Tapşırıqlar haqqında məlumat ala',
        'Qiymətləndirmələrini görə',
        'Müəllimləri ilə rahat ünsiyyət qura bilərlər',
      ],
    },
    {
      icon: '👥',
      title: 'Komanda İdarəçiliyi və Roller',
      description:
        'Kiroku çox səviyyəli idarəetmə mexanizminə malikdir. Burada hər kəs öz roluna uyğun imkanlara sahib olur:',
      list: ['Administrator', 'Filial rəhbəri', 'Müəllim', 'Tələbə'],
    },
  ];

  const benefits = [
    '✅ İstifadəsi çox rahat və intuitivdir',
    '✅ Hər ölçüdə tədris mərkəzinə uyğunlaşır',
    '✅ Davamiyyət, kurslar, materiallar və şəxsi məlumatlar vahid mərkəzdə',
    '✅ Genişlənə bilən və gələcək funksiyalara açıq sistem',
    '✅ Onlayn və hibrid tədris modelini tam dəstəkləyir',
  ];

  return (
    <div className={styles.landing}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>Kiroku</div>
          <button className={styles.loginButton} onClick={handleLoginClick}>
            Daxil ol
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Müasir Tədris və Kurs İdarəetmə Sistemi
          </h1>
          <p className={styles.heroSubtitle}>
            Bugünün sürətlə dəyişən dünyasında təhsil müəssisələri, kurs
            mərkəzləri və təlim platformaları üçün idarəetmə proseslərinin
            səlis, şəffaf və rahat şəkildə aparılması çox vacibdir. Kiroku –
            məhz bu ehtiyacdan doğan, sadə interfeysə və güclü funksionallığa
            malik öyrənmə və kurs idarəetmə sistemidir.
          </p>
          <button className={styles.heroCta} onClick={handleLoginClick}>
            İndi Başlayın
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContent}>
          <h2 className={styles.sectionTitle}>Əsas Xüsusiyyətlər</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
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

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.benefitsContent}>
          <h2 className={styles.sectionTitle}>Niyə Kiroku?</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitItem}>
                <span className={styles.benefitIcon}>✓</span>
                <span className={styles.benefitText}>
                  {benefit.replace('✅ ', '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Tədris İdarəçiliyini Sadələşdirin – Kiroku ilə
          </h2>
          <p className={styles.ctaDescription}>
            Kiroku sizin təhsil müəssisənizin daxili idarəetməsini gücləndirir,
            təlim keyfiyyətini artırır və vaxtınıza qənaət edir. Fokusunuzu
            sənədləşməyə deyil – həqiqi tədris prosesinə yönəldin.
          </p>
          <button className={styles.ctaButton} onClick={handleLoginClick}>
            İndi Başlayın
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2025 Kiroku. Bütün hüquqlar qorunur.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
