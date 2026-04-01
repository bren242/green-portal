import { TextInput, SelectInput, RefuseButton } from '../ui/FormField'

const MARITAL_OPTIONS = [
  { value: 'single', label: 'רווק/ה' },
  { value: 'married', label: 'נשוי/אה' },
  { value: 'divorced', label: 'גרוש/ה' },
  { value: 'widowed', label: 'אלמן/ה' },
]

function ClientFields({ title, client, onChange, isRefused, toggleRefusal, prefix }) {
  const update = (field, value) => {
    onChange({ ...client, [field]: value })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-green-primary border-b border-border pb-2">
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <TextInput label="שם מלא" value={client.fullName} onChange={(v) => update('fullName', v)} placeholder="שם פרטי ומשפחה" />
          </div>
          <RefuseButton field={`${prefix}.fullName`} label="שם מלא" isRefused={isRefused} toggleRefusal={toggleRefusal} />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <TextInput label="תעודת זהות" value={client.idNumber} onChange={(v) => update('idNumber', v)} placeholder="מספר ת.ז" />
          </div>
          <RefuseButton field={`${prefix}.idNumber`} label="תעודת זהות" isRefused={isRefused} toggleRefusal={toggleRefusal} />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <TextInput label="תאריך לידה" value={client.birthDate} onChange={(v) => update('birthDate', v)} type="date" />
          </div>
          <RefuseButton field={`${prefix}.birthDate`} label="תאריך לידה" isRefused={isRefused} toggleRefusal={toggleRefusal} />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <SelectInput label="מצב משפחתי" value={client.maritalStatus} onChange={(v) => update('maritalStatus', v)} options={MARITAL_OPTIONS} />
          </div>
          <RefuseButton field={`${prefix}.maritalStatus`} label="מצב משפחתי" isRefused={isRefused} toggleRefusal={toggleRefusal} />
        </div>
        <TextInput label="נפשות תלויות" value={client.dependents} onChange={(v) => update('dependents', v)} placeholder="מספר" />
        <TextInput label="טלפון" value={client.phone} onChange={(v) => update('phone', v)} placeholder="050-0000000" type="tel" />
        <TextInput label="דוא״ל" value={client.email} onChange={(v) => update('email', v)} placeholder="email@example.com" type="email" />
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <TextInput label="עיסוק" value={client.occupation} onChange={(v) => update('occupation', v)} placeholder="תחום עיסוק" />
          </div>
          <RefuseButton field={`${prefix}.occupation`} label="עיסוק" isRefused={isRefused} toggleRefusal={toggleRefusal} />
        </div>
      </div>
    </div>
  )
}

export default function PersonalStep({ formData, updateForm, isRefused, toggleRefusal }) {
  return (
    <div className="space-y-8">
      <ClientFields
        title={formData.signerType === 'couple' ? 'לקוח א׳' : 'פרטי הלקוח'}
        client={formData.clientA}
        onChange={(clientA) => updateForm({ clientA })}
        isRefused={isRefused}
        toggleRefusal={toggleRefusal}
        prefix="clientA"
      />
      {formData.signerType === 'couple' && (
        <ClientFields
          title="לקוח ב׳"
          client={formData.clientB}
          onChange={(clientB) => updateForm({ clientB })}
          isRefused={isRefused}
          toggleRefusal={toggleRefusal}
          prefix="clientB"
        />
      )}
    </div>
  )
}
