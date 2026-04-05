import { TextInput, SelectInput } from '../ui/FormField'

const MARITAL_OPTIONS = [
  { value: 'single', label: 'רווק/ה' },
  { value: 'married', label: 'נשוי/אה' },
  { value: 'divorced', label: 'גרוש/ה' },
  { value: 'widowed', label: 'אלמן/ה' },
]

function ClientFields({ title, client, onChange }) {
  const update = (field, value) => {
    onChange({ ...client, [field]: value })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-green-primary border-b border-border pb-2">
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="שם מלא *" value={client.fullName} onChange={(v) => update('fullName', v)} placeholder="שם פרטי ומשפחה" />
        <TextInput label="תעודת זהות *" value={client.idNumber} onChange={(v) => update('idNumber', v)} placeholder="מספר ת.ז" inputMode="numeric" onlyDigits />
        <TextInput label="תאריך לידה" value={client.birthDate} onChange={(v) => update('birthDate', v)} type="date" />
        <SelectInput label="מצב משפחתי" value={client.maritalStatus} onChange={(v) => update('maritalStatus', v)} options={MARITAL_OPTIONS} />
        <TextInput label="נפשות תלויות" value={client.dependents} onChange={(v) => update('dependents', v)} placeholder="מספר" />
        <TextInput label="טלפון נייד *" value={client.phone} onChange={(v) => update('phone', v)} placeholder="050-0000000" type="tel" />
        <TextInput label="דוא״ל *" value={client.email} onChange={(v) => update('email', v)} placeholder="email@example.com" type="email" />
        <TextInput label="עיסוק" value={client.occupation} onChange={(v) => update('occupation', v)} placeholder="תחום עיסוק" />
      </div>
    </div>
  )
}

export default function PersonalStep({ formData, updateForm }) {
  return (
    <div className="space-y-8">
      <ClientFields
        title={formData.signerType === 'couple' ? 'לקוח א׳' : 'פרטי הלקוח'}
        client={formData.clientA}
        onChange={(clientA) => updateForm({ clientA })}
      />
      {formData.signerType === 'couple' && (
        <ClientFields
          title="לקוח ב׳"
          client={formData.clientB}
          onChange={(clientB) => updateForm({ clientB })}
        />
      )}
    </div>
  )
}
