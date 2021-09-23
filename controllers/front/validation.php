<?php
class VenipakCodValidationModuleFrontController extends ModuleFrontController
{
	public $ssl = true;
	public $display_column_left = false;
	private $_prefix = 'VENIPAKCOD_';

	public function postProcess()
	{
		if ($this->context->cart->id_customer == 0 || $this->context->cart->id_address_delivery == 0 || $this->context->cart->id_address_invoice == 0 || !$this->module->active)
			Tools::redirectLink(__PS_BASE_URI__ . 'order.php?step=1');

		// Check that this payment option is still available in case the customer changed his address just before the end of the checkout process
		$authorized = false;
		foreach (Module::getPaymentModules() as $module)
			if ($module['name'] == 'venipakcod') {
				$authorized = true;
				break;
			}
		if (!$authorized)
			die(Tools::displayError('This payment method is not available.'));

		$customer = new Customer($this->context->cart->id_customer);
		if (!Validate::isLoadedObject($customer))
			Tools::redirectLink(__PS_BASE_URI__ . 'order.php?step=1');

		if (Tools::getValue('confirm')) {
			$customer = new Customer((int) $this->context->cart->id_customer);
			$total = $this->context->cart->getOrderTotal(true, Cart::BOTH);
			$this->module->validateOrder((int) $this->context->cart->id, Configuration::get('PS_OS_PREPARATION'), $total, $this->module->displayName, null, array(), null, false, $customer->secure_key);
			Tools::redirectLink(__PS_BASE_URI__ . 'order-confirmation.php?key=' . $customer->secure_key . '&id_cart=' . (int) $this->context->cart->id . '&id_module=' . (int) $this->module->id . '&id_order=' . (int) $this->module->currentOrder);
		}
	}

	/**
	 * @see FrontController::initContent()
	 */
	public function initContent()
	{
		parent::initContent();

		$this->context->smarty->assign(array(
			'total' => $this->context->cart->getOrderTotal(true, Cart::BOTH),
			'cod_fee' => (float) $this->getCodFee((float) $this->context->cart->getOrderTotal(false, Cart::BOTH_WITHOUT_SHIPPING)),
			'this_path' => $this->module->getPathUri(), //keep for retro compat
			'this_path_cod' => $this->module->getPathUri(),
			'this_path_ssl' => Tools::getShopDomainSsl(true, true) . __PS_BASE_URI__ . 'modules/' . $this->module->name . '/'
		));

		$this->setTemplate('validation.tpl');
	}

	/**
	 * Return calculated fee or false if not within range
	 * @param float $cart_total	Cart Total
	 * 
	 * @return bool|float
	 */
	public function getCodFee($cart_total)
	{
		$min = (float) Configuration::get($this->_prefix . 'TOTAL_MIN');
		$max = (float) Configuration::get($this->_prefix . 'TOTAL_MAX');

		// if min or max is set (not 0) check total is within range
		if (($min && (float) $cart_total < $min) || ($max && (float) $cart_total > $max)) {
			return false;
		}

		if (Configuration::get($this->_prefix . 'FEE_TYPE')) {
			// percentile fee
			$fee = (float) $cart_total * ((float) Configuration::get($this->_prefix . 'FEE_PERC') / 100);
		} else {
			// flat fee
			$fee = (float) Configuration::get($this->_prefix . 'FEE_FLAT');
		}

		return $fee > 0 ? $fee : false;
	}
}
