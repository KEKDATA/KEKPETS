$(document).ready(() => {
	const alert = document.querySelector('.sad_alert')
	const inputs = document.querySelectorAll('.inputfile');

	inputs.forEach(input => {
		const label = input.nextElementSibling;
		const labelValue = label.innerHTML;

		input.addEventListener('change', function (e) {
			let fileName = '';

			if (this.files && this.files.length > 1) {
				fileName = (this.getAttribute('data-multiple-caption') || '').replace(
					'{count}',
					`${this.files.length}`,
				);
			} else {
				fileName = e.target.value.split('\\').pop();
			}

			if (fileName) {
				label.querySelector('span').innerHTML = fileName;
			} else {
				label.innerHTML = labelValue;
			}

			if (alert) {
				alert.style.visibility = this.files.length > 35 ? 'visible' : 'hidden'
			}
		});
	});
});


