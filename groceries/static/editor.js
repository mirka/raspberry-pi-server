/*eslint-env jquery*/

$('[data-editor-open]').click((e) => {
	e.preventDefault();

	$('[data-editor-spinner]').addClass('spinner').show();
	fetch('./api/items')
		.then((res) => res.json())
		.then((data) => {
			$('[data-editor-textarea]').val(JSON.stringify(data, null, '  '));
			$('[data-editor]').slideDown(200);
			$('[data-editor-spinner]').hide();
		})
		.catch((err) => {
			alert(err);
		});

});

$('[data-editor-close]').click((e) => {
	e.preventDefault();

	$('[data-editor-textarea]').val('');
	$('[data-editor]').slideUp(200);
});

$('[data-editor-save]').click((e) => {
	const data = $('[data-editor-textarea]').val();
	e.preventDefault();
	$('[data-editor-spinner]').show();

	fetch('./api/items', {
		method: 'PUT',
		body: data,
		headers: new Headers({
			'Content-Type': 'application/json',
		}),
	})
		.then((res) => {
			$('[data-editor-spinner]').hide();

			if (res.status === 200) {
				$('.notification').removeClass('-hide');
				window.setTimeout(() => {
					$('.notification').addClass('-hide');
					$('[data-editor-close]').click();
				}, 1000);
			}
		})
		.catch((err) => {
			alert(err);
		});
});
