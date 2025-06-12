// src/components/Breadcrumbs/Breadcrumbs.js
import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs({ categories }) {
  // Ambil kategori pertama sebagai acuan breadcrumb
  const primaryCategory = categories && categories.length > 0 ? categories[0] : null;

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {primaryCategory && (
          <>
            <li aria-hidden="true" className={styles.separator}>›</li>
            <li>
              <Link href={primaryCategory.uri}>
                {primaryCategory.name}
              </Link>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}