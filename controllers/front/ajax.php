<?php
class VenipakCodAjaxModuleFrontController extends ModuleFrontController
{
    /**
     * @see FrontController::initContent()
     */
    public function initContent()
    {
        parent::initContent();
        $venipakModule = Module::getInstanceByName('mijoravenipak');
        if($venipakModule && $venipakModule->active)
        {
            $id_carrier = $this->context->cart->id_carrier;
            $carrier = new Carrier($id_carrier);
            $carrier_reference = $carrier->id_reference;

            // Check if the selected terminal is C.O.D. Otherwise, prompt user to select another one.
            $terminal_data = Db::getInstance()->getValue((new DbQuery())
                ->select('terminal_info')
                ->from('mjvp_orders')
                ->where('id_cart = ' . $this->context->cart->id)
            );
            $terminal_data = json_decode($terminal_data, true);
            if($carrier_reference == Configuration::get(MijoraVenipak::$_carriers['pickup']['reference_name']) && (isset($terminal_data['is_cod']) && !$terminal_data['is_cod']))
            {
                $content = $venipakModule->hookDisplayCarrierExtraContent(
                    [
                        'cart' => $this->context->cart,
                        'carrier' => (array) $carrier,
                        'filters' => ['cod_enabled' => 1],
                        'venipakcod' => 1
                    ]
                );
                $this->context->smarty->assign(
                    array(
                        'images_url' => $this->module->_path . 'views/images/',
                    )
                );
                die(json_encode([
                    'error' => $this->module->l('Your selected terminal does not support C.O.D payment method. Please select another terminal', 'Ajax'),
                    'carrier_content' => $content,
                    'mjvp_map_template' => $this->context->smarty->fetch(VenipakCod::$_moduleDir . '/views/templates/front/map-template.tpl'),
                ]));
            }
            else
            {
                die(json_encode(['success' => true]));
            }

        }
    }

}
