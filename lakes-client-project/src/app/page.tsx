import Link from 'next/link';
import { ProtectedShell } from '@/components/ProtectedShell';
import { PageHeader } from '@/components/PageHeader';
import { KpiCard } from '@/components/KpiCard';

export default function HomePage() {
  return (
    <ProtectedShell>
      <div className="stack">
        <PageHeader
          title="Главная"
          description="Клиентский интерфейс для просмотра озёр, карты и аналитики по каждому водоёму."
          action={
            <Link className="btn" href="/water-bodies">
              Открыть карту озёр
            </Link>
          }
        />

        <section className="grid cards-3">
          <KpiCard title="Карта водоёмов" value="MapLibre" hint="Выбор озера на карте и через dropdown" />
          <KpiCard title="Личный кабинет" value="Профиль" hint="Данные пользователя и аватарка" />
          <KpiCard title="Дашборд озера" value="Графики" hint="Фильтр по году и параметру" />
        </section>

        <section className="card stack">
          <h2 className="section-title">Что есть в клиентской версии</h2>
          <div className="details-grid">
            <div><strong>Хедер:</strong> адаптивный и общий для всех защищённых страниц.</div>
            <div><strong>Озёра:</strong> карта со всеми водоёмами из базы данных.</div>
            <div><strong>Навигация:</strong> переход в карточку водоёма по клику с карты или по кнопке.</div>
            <div><strong>Графики:</strong> отображение всех записей по параметру за выбранный год.</div>
            <div><strong>Профиль:</strong> личный кабинет пользователя с аватаркой.</div>
            <div><strong>Без админ-функций:</strong> нет CRUD-операций над пользователями и водоёмами.</div>
          </div>
        </section>
      </div>
    </ProtectedShell>
  );
}
