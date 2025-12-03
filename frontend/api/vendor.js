const getVendorData = async () => {
  const params = new URLSearchParams(window.location.search)
  const paramsValue = params.get('id')

  if (paramsValue === '' || !paramsValue) {
    window.location.href = '404.html'
  }

  try {
    const response = await fetch(`http://localhost:3000/${paramsValue}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      showAlert('No data available')
    }

    const data = await response.json()
    if (data.status === 'error') {
      showAlert(`${data.message}`, `${data.status}`)
    }

    console.log(data)
  } catch (error) {
    showAlert('Server Error. Please try again later')
  }
}

getVendorData()
