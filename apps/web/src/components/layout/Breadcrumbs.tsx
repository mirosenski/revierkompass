import { useRouterState, Link } from '@tanstack/react-router';

export function Breadcrumbs() {
  const matches = useRouterState({ select: (s) => s.matches });

  const crumbs = matches
    .filter((m) => m.context?.getTitle)
    .filter((m, i, arr) =>
      // Nur anzeigen, wenn nicht identischer Titel zum vorherigen
      i === 0 || m.context?.getTitle?.() !== arr[i - 1]?.context?.getTitle?.()
    )
    .map((m, index) => {
      const isLast = index === matches.length - 1;
      return (
        <span key={m.id} className="text-sm text-gray-600 dark:text-gray-300">
          {!isLast ? (
            <>
              <Link to={m.pathname} className="hover:underline text-blue-600 dark:text-blue-400">
                {m.context.getTitle?.()}
              </Link>
              <span className="mx-1">/</span>
            </>
          ) : (
            <span className="font-semibold text-gray-900 dark:text-white">{m.context.getTitle?.()}</span>
          )}
        </span>
      );
    });

  return (
    <nav className="px-4 pt-2 pb-4" aria-label="Breadcrumb">
      {crumbs}
    </nav>
  );
} 