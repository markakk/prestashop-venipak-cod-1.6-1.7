{*
* 2007-2016 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2016 PrestaShop SA
*  @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*}

{capture name=path}
	<a href="{$link->getPageLink('order', true, NULL, "step=3")|escape:'html':'UTF-8'}" rel="nofollow" title="{l s='Go back to the Checkout' mod='venipakcod'}">
		{l s='Checkout' mod='venipakcod'}
	</a>
	<span class="navigation-pipe">{$navigationPipe}</span>
	{l s='Venipak card on delivery (COD) payment' mod='venipakcod'}
{/capture}

<h2>{l s='Order summary' mod='venipakcod'}</h2>

{assign var='current_step' value='payment'}
{include file="$tpl_dir./order-steps.tpl"}

<h3>{l s='Venipak card on delivery (COD) payment' mod='venipakcod'}</h3>

<form action="{$link->getModuleLink('venipakcod', 'validation', [], true)|escape:'html'}" method="post">
	<input type="hidden" name="confirm" value="1" />
	<p>
		<img src="{$this_path_cod}logo.png" alt="{l s='Venipak card on delivery (COD) payment' mod='venipakcod'}"
		style="float:left; margin: 0px 10px 5px 0px; height: 33px;" />
		{l s='You have chosen Venipak card on Delivery method.' mod='venipakcod'}
		<br/><br />
		{l s='The total amount of your order is' mod='venipakcod'}
		<span id="amount_{$currencies.0.id_currency}" class="price">{convertPrice price=$total}</span>
		{if $cod_fee}
		<span id="amount_{$currencies.0.id_currency}" class="price">+ {convertPrice price=$cod_fee}</span>
		{/if}
		{if $use_taxes == 1}
		    {l s='(tax incl.)' mod='venipakcod'}
		{/if}
	</p>
	<p>
		<br /><br />
		<br /><br />
		<b>{l s='Please confirm your order by clicking \'I confirm my order\'.' mod='venipakcod'}</b>
	</p>
	<p class="cart_navigation" id="cart_navigation">
		<a href="{$link->getPageLink('order', true)}?step=3" class="button_large">{l s='Other payment methods' mod='venipakcod'}</a>
		<input type="submit" value="{l s='I confirm my order' mod='venipakcod'}" class="exclusive_large" />
	</p>
</form>
