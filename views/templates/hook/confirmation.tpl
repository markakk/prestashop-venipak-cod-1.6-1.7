<p>{l s='Your order on %s is complete.' sprintf=$shop_name mod='venipakcod'}
	<br /><br />
	{l s='You have chosen Venipak card on delivery method.' mod='venipakcod'}
	<br /><br /><span class="bold">{l s='Your order will be sent very soon.' mod='venipakcod'}</span>
	<br /><br />{l s='For any questions or for further information, please contact our' mod='venipakcod'} <a href="{$link->getPageLink('contact-form', true)|escape:'html'}">{l s='customer support' mod='venipakcod'}</a>.
</p>
