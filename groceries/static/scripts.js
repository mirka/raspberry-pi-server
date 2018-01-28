/*eslint-env jquery*/

function resultAsJson() {
	const result = { items: [] };

	$('#list input[type=checkbox]').filter(':not(:checked)').each((i, e) => {
		result.items.push({
			name: e.dataset.name,
			id: e.dataset.id,
		});
	});

	return result;
}

function update() {
	fetch('./api/items/needed', {
		method: 'PUT',
		body: JSON.stringify(resultAsJson()),
		headers: new Headers({
			'Content-Type': 'application/json',
		}),
	})
		.then((res) => {
			if (res.status === 200) {
				$('.notification').removeClass('-hide');
				window.setTimeout(() => {
					$('.notification').addClass('-hide');
				}, 1000);
			}
		})
		.catch((err) => {
			alert(err);
		});
}

function toggleCheckboxItem() {
	if ($(this).is(':checked')) {
		$(this).parent().addClass('checked');
	} else {
		$(this).parent().removeClass('checked');
	}
}

$('[data-done-btn]').click(update);
$('input[type="checkbox"]').change(toggleCheckboxItem);
$('input[type="reset"]').click(() => {
	$('input[type="checkbox"]').parent().removeClass('checked');
});
