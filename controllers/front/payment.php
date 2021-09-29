<?php

class VenipakCodPaymentModuleFrontController extends ModuleFrontController
{
    public $ssl = true;

    public function postProcess()
    {
        $cart = $this->context->cart;
        if ($cart->id_customer == 0 || $cart->id_address_delivery == 0 || $cart->id_address_invoice == 0 || !$this->module->active)
            Tools::redirectLink(__PS_BASE_URI__ . 'order.php?step=1');

        // Check that this payment option is still available in case the customer changed his address just before the end of the checkout process
        $authorized = false;
        foreach (Module::getPaymentModules() as $module)
            if ($module['name'] == 'venipakcod') {
                $authorized = true;
                break;
            }
        if (!$authorized)
            die($this->module->l('This payment method is not available.'));

        $customer = new Customer($cart->id_customer);
        if (!Validate::isLoadedObject($customer))
            Tools::redirectLink(__PS_BASE_URI__ . 'order.php?step=1');


        $customer = new Customer((int) $cart->id_customer);
        $total = $cart->getOrderTotal(true, Cart::BOTH);
        $this->module->validateOrder((int) $cart->id, Configuration::get('PS_OS_PREPARATION'), $total, $this->module->displayName, null, array(), null, false, $customer->secure_key);
        Tools::redirectLink(__PS_BASE_URI__ . 'order-confirmation.php?key=' . $customer->secure_key . '&id_cart=' . (int) $cart->id . '&id_module=' . (int) $this->module->id . '&id_order=' . (int) $this->module->currentOrder);
    }
}
