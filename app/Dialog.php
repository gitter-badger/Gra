<?php

namespace HempEmpire;


abstract class Dialog
{

	abstract protected function getTitle();
	abstract protected function getContent();




	public function render()
	{
		$html = '';

		$html .= '<div class="modal fade autoshow">';
		$html .= '<div class="modal-dialog">';
		$html .= '<div class="modal-content">';
		$html .= '<div class="modal-header">';
		$html .= '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
		$html .= '<h4 class="modal-title">' . $this->getTitle() . '</h4>';
		$html .= '</div>';
		$html .= '<div class="modal-body">';
		$html .= $this->getContent();
		$html .= '</div>';
		$html .= '</div>';
		$html .= '</div>';
		$html .= '</div>';

		return $html;
	}
}