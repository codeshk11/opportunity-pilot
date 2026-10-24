const fileInput = document.getElementById('profile-file')
const status = document.getElementById('status')
const fillButton = document.getElementById('fill')
const clearButton = document.getElementById('clear')

chrome.storage.local.get(['profile'], ({ profile }) => {
  if (profile) {
    status.textContent = 'Profile ready. You can fill a form on the current tab.'
    fillButton.disabled = false
  }
})

fileInput.addEventListener('change', async () => {
  const file = fileInput.files && fileInput.files[0]
  if (!file) return
  try {
    const profile = JSON.parse(await file.text())
    const requiredKeys = ['name', 'college', 'branch', 'year', 'state']
    if (!profile || typeof profile !== 'object' || !requiredKeys.every((key) => key in profile)) {
      throw new Error('This does not look like an OppPilot profile JSON.')
    }
    await chrome.storage.local.set({ profile })
    status.textContent = 'Profile imported. Open an opportunity form and click Fill this page.'
    fillButton.disabled = false
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'Could not read this file.'
    fillButton.disabled = true
  }
})

fillButton.addEventListener('click', async () => {
  const { profile } = await chrome.storage.local.get(['profile'])
  if (!profile) {
    status.textContent = 'Import your profile first.'
    return
  }
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.id || !tab.url || !/^https?:/.test(tab.url)) {
    status.textContent = 'Open a normal website form first.'
    return
  }
  try {
    const injection = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fillMatchingFields,
      args: [profile],
    })
    const count = injection?.[0]?.result ?? 0
    status.textContent = count
      ? `Filled ${count} field(s). Review them before submitting.`
      : 'No matching empty fields found. This site may use custom form controls.'
  } catch {
    status.textContent = 'This page does not allow autofill. Try a regular application form.'
  }
})

clearButton.addEventListener('click', async () => {
  await chrome.storage.local.remove('profile')
  fileInput.value = ''
  fillButton.disabled = true
  status.textContent = 'Saved profile cleared from this browser.'
})

// Runs only after the user clicks Fill this page. It fills empty fields only,
// avoids passwords/files/payment fields, and never submits or clicks buttons.
function fillMatchingFields(profile) {
  const values = {
    name: profile.name,
    'full name': profile.name,
    student: profile.name,
    college: profile.college,
    university: profile.college,
    institution: profile.college,
    'educational institution': profile.college,
    branch: profile.branch,
    stream: profile.branch,
    major: profile.branch,
    discipline: profile.branch,
    course: profile.branch,
    year: profile.year,
    'year of study': profile.year,
    'current year': profile.year,
    'academic year': profile.year,
    state: profile.state,
    category: profile.category,
    caste: profile.category,
    'social category': profile.category,
    'family income': profile.family_income_range,
    income: profile.family_income_range,
    cgpa: profile.cgpa,
    'current cgpa': profile.cgpa,
    skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills,
    interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests,
  }

  const normalize = (value) => String(value || '').toLowerCase().replace(/[_*:-]+/g, ' ').replace(/\s+/g, ' ').trim()
  const labelFor = (element) => {
    const bits = []
    if (element.labels) bits.push(...Array.from(element.labels).map((label) => label.innerText))
    const id = element.id
    if (id) {
      const label = document.querySelector(`label[for="${CSS.escape(id)}"]`)
      if (label) bits.push(label.innerText)
    }
    bits.push(element.getAttribute('aria-label'), element.getAttribute('placeholder'), element.getAttribute('name'), element.id)
    const parentLabel = element.closest('label')
    if (parentLabel) bits.push(parentLabel.innerText)
    return normalize(bits.filter(Boolean).join(' '))
  }

  const controls = Array.from(document.querySelectorAll('input, textarea, select'))
  let filled = 0
  for (const element of controls) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) continue
    if (element.disabled || element.readOnly) continue
    if (element instanceof HTMLInputElement && ['hidden', 'password', 'file', 'submit', 'button', 'reset', 'checkbox', 'radio', 'image'].includes(element.type)) continue
    if (element instanceof HTMLInputElement && /password|otp|captcha|payment|card|bank|account number|upi|aadhaar|pan number/i.test(labelFor(element))) continue
    if (element.value?.trim()) continue

    const label = labelFor(element)
    const match = Object.entries(values)
      .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
      .sort(([a], [b]) => b.length - a.length)
      .find(([key]) => label === key || label.includes(key) || key.includes(label) && label.length > 3)
    if (!match) continue

    const value = String(match[1])
    if (element instanceof HTMLSelectElement) {
      const option = Array.from(element.options).find((item) => normalize(item.label) === normalize(value) || normalize(item.value) === normalize(value))
      if (!option) continue
      element.value = option.value
    } else {
      const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
      if (setter) setter.call(element, value)
      else element.value = value
    }
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
    filled += 1
  }
  return filled
}
