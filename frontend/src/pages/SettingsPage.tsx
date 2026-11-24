import {
  Bell,
  Info,
  Moon,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import packageJson from '../../package.json'

const comingSoonFeatures = [
  {
    title: 'Theme',
    description: 'Choose the look and feel that works best for your workspace.',
    icon: Moon,
  },
  {
    title: 'User Preferences',
    description: 'Personalize your RestaurantAI experience.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Notifications',
    description: 'Manage alerts for stock levels and expiring batches.',
    icon: Bell,
  },
]

export const SettingsPage = () => (
  <div className="space-y-6">
    <header>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">
        Application information and preferences.
      </p>
    </header>

    <section aria-labelledby="preferences-heading">
      <div className="mb-3">
        <h2 id="preferences-heading" className="text-base font-semibold text-slate-900">
          Preferences
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          These personalization options are planned for a future release.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {comingSoonFeatures.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                Coming soon
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          </article>
        ))}
      </div>
    </section>

    <section
      aria-labelledby="about-heading"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Info aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="about-heading" className="text-base font-semibold text-slate-900">
            About RestaurantAI
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            RestaurantAI helps restaurant teams manage ingredients, inventory,
            recipes, and menu availability from one workspace.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Application version{' '}
            <span className="font-medium text-slate-700">v{packageJson.version}</span>
          </p>
        </div>
      </div>
    </section>

    <section
      id="future-enhancements"
      aria-labelledby="future-enhancements-heading"
      className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700">
          <Sparkles aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2
            id="future-enhancements-heading"
            className="text-base font-semibold text-slate-900"
          >
            Future Enhancements
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Themes, personal preferences, and configurable notifications are
            planned. Existing inventory, recipe, and availability workflows
            continue to work independently of these future settings.
          </p>
        </div>
      </div>
    </section>
  </div>
)

export default SettingsPage
