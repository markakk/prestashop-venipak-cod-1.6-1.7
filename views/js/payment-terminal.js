$(document).on('ready', () => {
    if(typeof page_name != "undefined" && page_name == 'order-opc')
    {
        $( document ).ajaxComplete(function( event, xhr, settings ) {
            if ( settings.data.includes('updateTOSStatusAndGetPayments&checked=1')) {
                codEventListener();
                $.ajax({
                    type: "POST",
                    url: mjvp_front_controller_url + "?ajax=1&submitFilterTerminals=1&action=filter",
                    dataType: "json",
                    data: {
                        'filter_keys' : {'cod_enabled' : 1}
                    },
                    success: function (res) {
                        venipak_custom_modal.tmjs.dom.removeOverlay();
                        if(typeof res.mjvp_terminals != "undefined")
                        {
                            var terminals = [];
                            mjvp_terminals = res.mjvp_terminals;
                            mjvp_terminals.forEach((terminal) => {
                                if(terminal.lat != 0 && terminal.lng != 0 && terminal.terminal)
                                {
                                    terminal['coords'] = {
                                        lat: terminal.lat,
                                        lng: terminal.lng
                                    };
                                    // Pickup type
                                    if(terminal.type == 1)
                                        terminal['identifier'] = 'venipak-pickup';
                                    // Locker type
                                    else if(terminal.type == 3)
                                        terminal['identifier'] = 'venipak-locker';
                                    terminals.push(terminal);
                                }
                            });
                            if(terminals.length == 0)
                            {
                                venipak_custom_modal.tmjs.map._markerLayer.clearLayers();
                            }
                            else
                            {
                                venipak_custom_modal.tmjs.setTerminals(terminals);
                                venipak_custom_modal.tmjs.dom.renderTerminalList(venipak_custom_modal.tmjs.map.locations);
                            }
                        }
                    },
                });
            }
        });
    }
    else
    {
        codEventListener();

    }
});

function codEventListener() {
    $('.venipakcod').on('click', () => {
        event.preventDefault();
        if(!$(event.target).hasClass('tmjs-open-modal-btn'))
        {
            $('.venipak-service-content').remove();
            $('.venipakcod .alert').remove();
            $(".mjvp-pickup-filter").unbind('click');
            $.ajax({
                type: "POST",
                url: cod_ajax_url,
                dataType: "json",
                success: function (res) {
                    if(typeof res.carrier_content != 'undefined' && typeof res.mjvp_map_template != 'undefined' && res.carrier_content)
                    {
                        var error = '';
                        if(typeof res.error != 'undefined')
                        {
                            error = `<div class="alert alert-danger">${res.error}</div>`;
                        }
                        $('.venipakcod').append(error);
                        mjvp_map_template = res.mjvp_map_template;
                        $('.venipakcod').append(`
                        <div class="venipak-service-content">
                            ${res.carrier_content}
                        </div>`);
                        if($('.tmjs-modal').length != 0)
                            $('.tmjs-modal').remove();
                        venipak_custom_modal();
                        filterEventListener();
                    }
                    else
                    {
                        document.location = $('.venipakcod').attr('href');
                    }
                },
            });
        }
    });
}

function filterEventListener()
{
    $(".mjvp-pickup-filter").on('click', e => {
        venipak_custom_modal.tmjs.dom.addOverlay();
        const clickTarget = $(e.target);
        if(clickTarget.hasClass('reset'))
        {
            $("#filter-container input[type='checkbox']").each((i, el) => {
                $(el).prop('checked', true);
            });
        }

        var selectedFilters = {};
        var countChecked = 0;
        $("#filter-container input[type='checkbox']").each((i, el) => {
            if($(el).is(':checked'))
            {
                countChecked++;
                selectedFilters['type'] = $(el).data('filter');
            }
        });
        if(countChecked == 2)
            selectedFilters = {};
        else if(countChecked == 0)
            selectedFilters['type'] = 0;
        selectedFilters['cod_enabled'] = 1;

        $('.mjvp-pickup-filter').removeClass('active');
        $.ajax({
            type: "POST",
            url: mjvp_front_controller_url + "?ajax=1&submitFilterTerminals=1&action=filter",
            dataType: "json",
            data: {
                'filter_keys' : selectedFilters
            },
            success: function (res) {
                venipak_custom_modal.tmjs.dom.removeOverlay();
                if(typeof res.mjvp_terminals != "undefined")
                {
                    var terminals = [];
                    mjvp_terminals = res.mjvp_terminals;
                    mjvp_terminals.forEach((terminal) => {
                        if(terminal.lat != 0 && terminal.lng != 0 && terminal.terminal)
                        {
                            terminal['coords'] = {
                                lat: terminal.lat,
                                lng: terminal.lng
                            };
                            // Pickup type
                            if(terminal.type == 1)
                                terminal['identifier'] = 'venipak-pickup';
                            // Locker type
                            else if(terminal.type == 3)
                                terminal['identifier'] = 'venipak-locker';
                            terminals.push(terminal);
                        }
                    });
                    if(terminals.length == 0)
                    {
                        venipak_custom_modal.tmjs.map._markerLayer.clearLayers();
                    }
                    else
                    {
                        venipak_custom_modal.tmjs.setTerminals(terminals);
                        venipak_custom_modal.tmjs.dom.renderTerminalList(venipak_custom_modal.tmjs.map.locations);
                    }
                }
            },
        });
    });
}

function mjvp_registerSelection(selected_field_id, ajaxData = {}, params = {}) {
    if(document.getElementById(selected_field_id))
        ajaxData.selected_terminal = document.getElementById(selected_field_id).value;
    if(document.getElementById("mjvp-pickup-country"))
        ajaxData.country_code = document.getElementById("mjvp-pickup-country").value;

    var terminal = null;
    mjvp_terminals.forEach((val, i) => {
        if(parseInt(val.id) == parseInt(ajaxData.selected_terminal)) {
            terminal = val;
        }
    });
    ajaxData.terminal = terminal;

    if(terminal.cod_enabled == 1)
    {
        $('.venipak-service-content').remove();
        $('.venipakcod .alert').remove();
    }

    $.ajax(mjvp_front_controller_url,
        {
            data: ajaxData,
            type: "POST",
            dataType: "json",
        })
        .always(function (jqXHR, status) {
            if(typeof jqXHR.errors != 'undefined')
            {
                $('[id^="delivery_option"]:checked').parents('.delivery_option ').prepend(jqXHR.errors);
                if(typeof params.scrollToError != "undefined")
                {
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $(".alert.alert-danger").offset().top - 100
                    }, 800);
                }
            }
            else if(typeof params.href != "undefined")
            {
                document.location = params.href;
            }
            if (typeof jqXHR === 'object' && jqXHR !== null && 'msg' in jqXHR) {
                console.log(jqXHR.msg);
            } else {
                console.log(jqXHR);
            }
        });
}
